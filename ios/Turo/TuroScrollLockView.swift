//
//  TuroScrollLockView.swift
//  Turo
//
//  Created by James Hugman on 6/14/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

import Foundation

/* TODO listen for keyboard events and scroll content accordingly.

https://developer.apple.com/library/ios/documentation/StringsTextFonts/Conceptual/TextAndWebiPhoneOS/KeyboardManagement/KeyboardManagement.html#//apple_ref/doc/uid/TP40009542-CH5-SW7
*/
public class TuroScrollLockView: RCTView {

    var scrollViews: [UIScrollView] = []
    var delegates: [LockingScrollViewDelegate] = []

    public override func didAddSubview(view: UIView) {
        print("Adding subview to scroll lock \(view)")
        super.didAddSubview(view)

        if (addCustomDelegate(view)) {
            return
        }

        let subviews = view.subviews
        if subviews.count == 1 {
            addCustomDelegate(subviews[0])
        }
    }

    func addCustomDelegate(view: UIView) -> Bool {
        if let textView = view as? UITextView {
            let delegate = LockingScrollViewDelegate(parent: self, forwardingDelegate: textView.delegate)
            textView.delegate = delegate

            delegates.append(delegate)
            scrollViews.append(textView)
            return true
        } else if let scrollView = view as? UIScrollView {
            let delegate = LockingScrollViewDelegate(parent: self, forwardingDelegate: scrollView.delegate)
            scrollView.delegate = delegate

            delegates.append(delegate)
            scrollViews.append(scrollView)
            return true
        }

        return false
    }

    func lockScrollViewDidScroll(scrollView: UIScrollView) {
        let newY = scrollView.contentOffset.y
        for child in scrollViews {
            if child != scrollView {
                var point = child.contentOffset
                point.y = newY
                child.contentOffset = point
            }
        }
    }


}

class LockingScrollViewDelegate: ForwardingUIScrollViewDelegate {

    let parent: TuroScrollLockView


    init(parent: TuroScrollLockView, forwardingDelegate: AnyObject?) {

        self.parent = parent

        super.init()
        if let delegate = forwardingDelegate as? ForwardingUIScrollViewDelegate {
            self.nativeMainScrollDelegate = delegate
        } else {
            self.nativeMainScrollDelegate = nil
        }

    }

    // any offset changes
    @objc override func scrollViewDidScroll(scrollView: UIScrollView) {
        self.parent.lockScrollViewDidScroll(scrollView)
        super.scrollViewDidScroll(scrollView)
    }
}

