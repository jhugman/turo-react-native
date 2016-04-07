//
//  TextEditor.swift
//  Turo
//
//  Created by James Hugman on 5/26/15.
//  Copyright (c) 2015 Turo. All rights reserved.
//

import Foundation
import UIKit

public class TextEditor: RCTView {

    let textView: UITextView
    let textStorage: SyntaxHighlightTextStorage

    let eventDispatcher: RCTEventDispatcher

    var hasNewText: Bool = false

    class func createTextContainer (textStorage: NSTextStorage) -> NSTextContainer {
        // 1. Create the text storage that backs the editor
        //let attrs = [NSFontAttributeName : UIFont.preferredFontForTextStyle(UIFontTextStyleBody)]

        // 2. Create the layout manager
        let layoutManager = NSLayoutManager()

        // 3. Create a text container
        let containerSize = CGSize(width: 0, height: CGFloat.max)
        let container = NSTextContainer(size: containerSize)
        container.widthTracksTextView = true
        layoutManager.addTextContainer(container)
        textStorage.addLayoutManager(layoutManager)
        return container
    }

    init(eventDispatcher: RCTEventDispatcher) {
        self.textStorage = SyntaxHighlightTextStorage()
        let textContainer = TextEditor.createTextContainer(self.textStorage)
        self.textView = TuroCodeView(frame: CGRectZero, textContainer: textContainer)
        self.eventDispatcher = eventDispatcher
        super.init(frame: CGRectZero)
        initTextView()
        textView.delegate = self
    }

    public required init(coder aDecoder: NSCoder) {
        self.textView = TuroCodeView(coder: aDecoder)!
        self.eventDispatcher = RCTEventDispatcher()
        self.textStorage = SyntaxHighlightTextStorage()
        super.init(frame: CGRectZero)
        initTextView()
    }

    private func initTextView() {
        let textView = self.textView
        textView.scrollEnabled = true
        textView.editable = true
        textView.showsVerticalScrollIndicator = false
//        textView.inputAccessoryView = TextEditor.createRootView("EditorAccessory")
        self.addSubview(textView)
    }

    @objc public var editorText: NSString {
        set {
            if (textView.text != newValue) {
                textView.text = newValue as String
                hasNewText = true
            }
        }
        get {
            return textView.text as NSString
        }
    }


    @objc public var selection: [String:AnyObject] {
        set {
            let beginning = textView.beginningOfDocument
            if let
                start = newValue["start"] as? Int,
                end = newValue["end"] as? Int,
                startPosition = textView.positionFromPosition(beginning, offset: start),
                endPosition = textView.positionFromPosition(beginning, offset: end) {
                  textView.selectedTextRange = textView.textRangeFromPosition(startPosition, toPosition: endPosition)
            }

            if let menuItems = newValue["menuItems"] as? [String] {
                self.menuItems = menuItems
            }
        }
        get {
            // from http://stackoverflow.com/a/14175224/4737
            let beginning = textView.beginningOfDocument
            if let selection = textView.selectedTextRange {
                let start = textView.offsetFromPosition(beginning, toPosition: selection.start)
                let end = textView.offsetFromPosition(beginning, toPosition: selection.end)

                let body: [String: AnyObject] = [
                    "target": self.reactTag,
                    "start": start,
                    "end": end
                ]
                return body
            }
            return [
                "target": self.reactTag,
                "start": 0,
                "end": 0
            ]
        }
    }

    @objc public var keyboardVisibility: [String: AnyObject] {
        set {
            var requestFocus = false

            if let firstResponderRequested = newValue["focus"] as? Bool {
                let isFirstResponder = textView.isFirstResponder()
                if (isFirstResponder && !firstResponderRequested) {
                    textView.resignFirstResponder()
                    textView.inputView = nil
                    return
                } else if (!isFirstResponder && firstResponderRequested) {
                    requestFocus = true
                }
            }
            if let visible = newValue["visible"] as? Bool {
                textView.inputView = visible ? nil : UIView(frame: CGRectZero)
                textView.reloadInputViews()
            }
            if (requestFocus) {
                textView.becomeFirstResponder()
            }
        }
        get {
            return [:]
        }
    }

    @objc public var textInsert: [String: AnyObject] {
        set {
            if let text = newValue["text"] as? String {
                textView.insertText(text)
            }
        }
        get {
            return [:]
        }
    }

    @objc public var textDelete: [String: AnyObject] {
        set {
            if let num = newValue["deleteLength"] as? Int {
              for _ in 0...num {
                textView.deleteBackward()
              }
            } else {
              textView.deleteBackward()
            }
        }
        get {
            return [:]
        }
    }

    @objc public var menuItems: [String] = [] {
        didSet {
            let controller = UIMenuController.sharedMenuController()
            let visible = controller.menuVisible
            if visible {
                controller.setMenuVisible(false, animated: false)
                textView.reloadInputViews()
            }
            var i = 0
            controller.menuItems = menuItems.map({ item in
                UIMenuItem(title: item, action: Selector("menuItemTapped_\(i++):"))
            })
            if visible {
                controller.setMenuVisible(true, animated: false)
            }
        }
    }
}

extension TextEditor {
    @objc override public func layoutSubviews() {
        super.layoutSubviews()
        self.textView.frame = self.bounds
        if (hasNewText) {
            let softWraps = calculateTextWrappedLines()
            let body: [String: AnyObject] = [
                "target": self.reactTag,
                "textWrappingOffsets": softWraps
            ]
            self.eventDispatcher.sendInputEventWithName("initDone", body: body)
            hasNewText = false
        }
    }
}

extension TextEditor: UITextViewDelegate {
    public func textViewDidChange(textView: UITextView) {
        let softWraps = calculateTextWrappedLines()
        let body: [String: AnyObject] = [
            "target": self.reactTag,
            "text": textView.text,
            "textWrappingOffsets": softWraps
        ]
        self.eventDispatcher.sendInputEventWithName("changeDocument", body: body)
    }

    public func textViewDidChangeSelection(textView: UITextView) {
        var body: [String: AnyObject] = self.selection
        body["target"] = self.reactTag
        self.eventDispatcher.sendInputEventWithName("changeSelection", body: body)
    }
}

extension TextEditor {

    func menuItemTapped(index: Int) {
        var body: [String: AnyObject] = self.selection
        body["target"] = self.reactTag
        body["actionLabel"] = menuItems[index]
        self.eventDispatcher.sendInputEventWithName("menuItemTapped", body: body)
    }

    func menuItemTapped_0 (arg: UIMenuController) {
        menuItemTapped(0)
    }

    func menuItemTapped_1 (arg: UIMenuController) {
        menuItemTapped(1)
    }

    func menuItemTapped_2 (arg: UIMenuController) {
        menuItemTapped(2)
    }

    public override func canBecomeFirstResponder() -> Bool {
        return true
    }

    public override func canPerformAction(action: Selector, withSender sender: AnyObject?) -> Bool {
        // You need to only return true for the actions you want, otherwise you get the whole range of
        //  iOS actions. You can see this by just removing the if statement here.

        for i in 0...2 {
            if action == Selector("menuItemTapped_\(i):") {
                return true
            }
        }
        return false
    }

    func calculateTextWrappedLines () -> [NSDictionary] {
        var lineInfos: [NSDictionary] = []
        let layoutManager = textView.layoutManager
        let numberOfGlyphs = layoutManager.numberOfGlyphs

        // TODO replace this with just the number of soft lines per hard line.
        for (var numberOfLines = 0, index = 0; index < numberOfGlyphs; numberOfLines += 1) {
            var lineRange : NSRange = NSMakeRange(0, 1)
            let lineFragmentRect = layoutManager.lineFragmentRectForGlyphAtIndex(index, effectiveRange: &lineRange)
            index = NSMaxRange(lineRange)
            let lineInfo = [
                "lineNum": numberOfLines,
                "offsetFirst": lineRange.location,
                "offsetLast": lineRange.location + lineRange.length - 1,
                "lineLength": lineRange.length,
                "top": lineFragmentRect.maxY,
                "bottom": lineFragmentRect.minY,
            ]
            lineInfos.append(lineInfo)
        }

        return lineInfos
    }
}

class TuroCodeView: UITextView {
    override func canPerformAction(action: Selector, withSender sender: AnyObject?) -> Bool {
        // You need to only return true for the actions you want, otherwise you get the whole range of
        //  iOS actions. You can see this by just removing the if statement here.
        for sel in ["select", "selectAll", "defineSelection"] {
            if action == Selector("\(sel):") {
                return false
            }
        }
        return super.canPerformAction(action, withSender: sender)
    }
}