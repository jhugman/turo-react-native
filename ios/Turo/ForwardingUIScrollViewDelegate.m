//
//  ForwardingUIScrollViewDelegate.m
//  Turo
//
//  Created by James Hugman on 6/14/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "ForwardingUIScrollViewDelegate.h"

@implementation ForwardingUIScrollViewDelegate

@synthesize nativeMainScrollDelegate = _nativeMainScrollDelegate;


#define RCT_SCROLL_EVENT_HANDLER(delegateMethod) \
- (void)delegateMethod:(UIScrollView *)scrollView           \
{                           \
if ([_nativeMainScrollDelegate respondsToSelector:_cmd]) { \
[_nativeMainScrollDelegate delegateMethod:scrollView]; \
} \
}

#define RCT_FORWARD_SCROLL_EVENT(call) \
     \
if ([_nativeMainScrollDelegate respondsToSelector:_cmd]) { \
[_nativeMainScrollDelegate call]; \
}

RCT_SCROLL_EVENT_HANDLER(scrollViewDidEndScrollingAnimation)
RCT_SCROLL_EVENT_HANDLER(scrollViewWillBeginDecelerating)
RCT_SCROLL_EVENT_HANDLER(scrollViewDidEndDecelerating)
RCT_SCROLL_EVENT_HANDLER(scrollViewDidZoom)

RCT_SCROLL_EVENT_HANDLER(scrollViewDidScroll)
RCT_SCROLL_EVENT_HANDLER(scrollViewWillBeginDragging)

#pragma mark
#pragma UIScrollViewDelegate
- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{
    RCT_FORWARD_SCROLL_EVENT(scrollViewWillEndDragging:scrollView withVelocity:velocity targetContentOffset:targetContentOffset);
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{
    RCT_FORWARD_SCROLL_EVENT(scrollViewDidEndDragging:scrollView willDecelerate:decelerate);
}

- (void)scrollViewWillBeginZooming:(UIScrollView *)scrollView withView:(UIView *)view
{
    RCT_FORWARD_SCROLL_EVENT(scrollViewWillBeginZooming:scrollView withView:view);
}

- (void)scrollViewDidEndZooming:(UIScrollView *)scrollView withView:(UIView *)view atScale:(CGFloat)scale
{
    RCT_FORWARD_SCROLL_EVENT(scrollViewDidEndZooming:scrollView withView:view atScale:scale);
}

- (BOOL)scrollViewShouldScrollToTop:(UIScrollView *)scrollView
{
    if ([_nativeMainScrollDelegate respondsToSelector:_cmd]) {
        return [_nativeMainScrollDelegate scrollViewShouldScrollToTop:scrollView];
    }
    return YES;
}

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView
{
    if ([_nativeMainScrollDelegate respondsToSelector:_cmd]) {
        return [_nativeMainScrollDelegate viewForZoomingInScrollView:scrollView];
    }
    return nil;
}

#pragma mark
#pragma UITextViewDelegate

#define RCT_TEXT_EVENT_HANDLER(delegateMethod) \
- (void)delegateMethod:(UITextView *)textView           \
{                           \
if ([_nativeMainScrollDelegate respondsToSelector:_cmd]) { \
[_nativeMainScrollDelegate delegateMethod:textView]; \
} \
}

#define RCT_FORWARD_TEXT_EVENT(call) \
if ([_nativeMainScrollDelegate respondsToSelector:_cmd]) { \
[_nativeMainScrollDelegate call]; \
}

//- (BOOL)textViewShouldBeginEditing:(UITextView *)textView;
//- (BOOL)textViewShouldEndEditing:(UITextView *)textView;
RCT_TEXT_EVENT_HANDLER(textViewDidBeginEditing)
RCT_TEXT_EVENT_HANDLER(textViewDidEndEditing)
//- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text;
RCT_TEXT_EVENT_HANDLER(textViewDidChange)
RCT_TEXT_EVENT_HANDLER(textViewDidChangeSelection)
//- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange NS_AVAILABLE_IOS(7_0);
//- (BOOL)textView:(UITextView *)textView shouldInteractWithTextAttachment:(NSTextAttachment *)textAttachment inRange:(NSRange)characterRange NS_AVAILABLE_IOS(7_0);

@end