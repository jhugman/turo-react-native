//
//  SyntaxHighlightTextStorage.swift
//  TuroNotepad
//
//  Created by Gabriel Hauber on 18/07/2014.
//  Copyright (c) 2014 Gabriel Hauber. All rights reserved.
//

import UIKit

class SyntaxHighlightTextStorage: NSTextStorage {
    let backingStore = NSMutableAttributedString()
    var replacements: [String : [String : AnyObject]]!

    let paragraph: NSMutableParagraphStyle
    let normalAttrs: [String: AnyObject]

  override init() {
    paragraph = NSMutableParagraphStyle()
    paragraph.lineSpacing = 4
    paragraph.paragraphSpacing = 16
    normalAttrs = [NSFontAttributeName : UIFont.preferredFontForTextStyle(UIFontTextStyleBody),
        NSParagraphStyleAttributeName: paragraph]
    super.init()
    createHighlightPatterns()
  }

  required init?(coder aDecoder: NSCoder) {
    paragraph = NSMutableParagraphStyle()
    normalAttrs = [NSFontAttributeName : UIFont.preferredFontForTextStyle(UIFontTextStyleBody),
        NSParagraphStyleAttributeName: paragraph]
    super.init(coder: aDecoder)
  }

  override var string: String {
    return backingStore.string
  }

  @objc override func attributesAtIndex(index: Int, effectiveRange range: NSRangePointer) -> [String : AnyObject] {
    return backingStore.attributesAtIndex(index, effectiveRange: range)
  }

  override func replaceCharactersInRange(range: NSRange, withString str: String) {
//    println("replaceCharactersInRange:\(range) withString:\(str)")

    beginEditing()
    backingStore.replaceCharactersInRange(range, withString:str)
    let mask  = NSTextStorageEditActions.EditedAttributes.union(.EditedCharacters)
    edited(mask, range: range, changeInLength: (str as NSString).length - range.length)
    endEditing()
  }

  override func setAttributes(attrs: [String : AnyObject]!, range: NSRange) {
    //println("setAttributes: range:\(range)")

    beginEditing()
    backingStore.setAttributes(attrs, range: range)
    edited(.EditedAttributes, range: range, changeInLength: 0)
    endEditing()
  }

  func applyStylesToRange(searchRange: NSRange) {


    // iterate over each replacement
    for (pattern, attributes) in replacements {
      do {
        let regex = try NSRegularExpression(pattern: pattern, options: .AnchorsMatchLines)
        let string = backingStore.string
        let stringLength = self.length
        regex.enumerateMatchesInString(string, options: .Anchored, range: searchRange) {
          match, flags, stop in
          // apply the style
          guard let match = match else {
            return
          }
          let matchRange = match.rangeAtIndex(1)
          self.addAttributes(attributes, range: matchRange)

          // reset the style to the original
          let maxRange = matchRange.location + matchRange.length
          if maxRange + 1 < stringLength {
            self.addAttributes(self.normalAttrs, range: NSMakeRange(maxRange, 1))
          }
        }
      } catch let error {
        print("Regex \(pattern) failed: \(error)")
      }
    }
  }

  func performReplacementsForRange(changedRange: NSRange) {
    var extendedRange = NSUnionRange(changedRange, NSString(string: backingStore.string).lineRangeForRange(NSMakeRange(changedRange.location, 0)))
    extendedRange = NSUnionRange(changedRange, NSString(string: backingStore.string).lineRangeForRange(NSMakeRange(NSMaxRange(changedRange), 0)))
    setAttributes(normalAttrs, range: extendedRange)
    applyStylesToRange(extendedRange)
  }

  override func processEditing() {
    performReplacementsForRange(self.editedRange)
    super.processEditing()
  }

  func createAttributesForFontStyle(style: String, withTrait trait: UIFontDescriptorSymbolicTraits) -> [String : AnyObject] {
    let fontDescriptor = UIFontDescriptor.preferredFontDescriptorWithTextStyle(UIFontTextStyleBody)
    let descriptorWithTrait = fontDescriptor.fontDescriptorWithSymbolicTraits(trait)
    let font = UIFont(descriptor: descriptorWithTrait, size: 0)

    return [
        NSFontAttributeName : font,
        NSParagraphStyleAttributeName: paragraph,
    ]
  }

  func createHighlightPatterns() {
    let scriptFontDescriptor = UIFontDescriptor(fontAttributes: [UIFontDescriptorFamilyAttribute : "Zapfino"])

    // 1. base our script font on the preferred body font size
    let bodyFontDescriptor = UIFontDescriptor.preferredFontDescriptorWithTextStyle(UIFontTextStyleBody)
    let bodyFontSize = bodyFontDescriptor.fontAttributes()[UIFontDescriptorSizeAttribute] as! NSNumber
    let scriptFont = UIFont(descriptor: scriptFontDescriptor, size: CGFloat(bodyFontSize.floatValue))

    // 2. create the attributes
    var numberTextAttributes = createAttributesForFontStyle(UIFontTextStyleBody, withTrait:.TraitBold)
    let boldAttributes = createAttributesForFontStyle(UIFontTextStyleBody, withTrait:.TraitBold)
    let italicAttributes = createAttributesForFontStyle(UIFontTextStyleBody, withTrait:.TraitItalic)
    let strikeThroughAttributes = [NSStrikethroughStyleAttributeName : 1]
    let scriptAttributes = [NSFontAttributeName : scriptFont]
    let redTextAttributes = [NSForegroundColorAttributeName : UIColor.redColor()]
    
    numberTextAttributes[NSForegroundColorAttributeName] = UIColor.blueColor()

    // construct a dictionary of replacements based on regexes
    replacements = [
      "(\\*\\w+(\\s\\w+)*\\*)" : boldAttributes,
      "(_\\w+(\\s\\w+)*_)" : italicAttributes,
      "([0-9]+(\\.[0-9]+)?(e[+-]?[0-9]+)?)" : numberTextAttributes,
      "(-\\w+(\\s\\w+)*-)" : strikeThroughAttributes,
      "(~\\w+(\\s\\w+)*~)" : scriptAttributes,
      "\\b([A-Z]{2,})\\b" : redTextAttributes
    ]
  }

  func update() {
    // update the highlight patterns
    createHighlightPatterns()

    // change the 'global' font
    setAttributes(self.normalAttrs, range: NSMakeRange(0, length))

    // re-apply the regex matches
    applyStylesToRange(NSMakeRange(0, length))
  }

}
