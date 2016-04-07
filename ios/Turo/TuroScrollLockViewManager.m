//
//  TuroScrollLockViewManager.m
//  Turo
//
//  Created by James Hugman on 6/14/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "TuroScrollLockViewManager.h"
#import "Turo-Swift.h"
#import "RCTBridge.h"

#import <UIKit/UIKit.h>

@implementation TuroScrollLockViewManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
    return [[TuroScrollLockView alloc] init];
}

@end