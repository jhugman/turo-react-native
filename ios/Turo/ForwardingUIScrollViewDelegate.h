//
//  ForwardingUIScrollViewDelegate.h
//  Turo
//
//  Created by James Hugman on 6/14/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIScrollView.h>
#import "RCTScrollableProtocol.h"

@interface ForwardingUIScrollViewDelegate : NSObject<UIScrollViewDelegate, UITextViewDelegate>

// TODO this came from RCTScrollableProtocol, which we should probably implement.
@property (nonatomic, weak) NSObject<UIScrollViewDelegate, UITextViewDelegate> *nativeMainScrollDelegate;

@end