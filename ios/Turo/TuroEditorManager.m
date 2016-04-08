//
//  TuroEditorManager.m
//  TuroEditor
//
//  Created by Thomas Parslow on 05/04/2015.
//  Copyright (c) 2015 Thomas Parslow. MIT Licensed
//

#import "TuroEditorManager.h"
#import "Turo-Swift.h"
#import "RCTBridge.h"

#import <UIKit/UIKit.h>

@implementation TuroEditorManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(editorText, NSString)
RCT_EXPORT_VIEW_PROPERTY(selection, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(menuItems, NSArray)
RCT_EXPORT_VIEW_PROPERTY(textInsert, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(textDelete, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(keyboardVisibility, NSDictionary)

RCT_EXPORT_VIEW_PROPERTY(onChangeDocument, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onInit, RCTBubblingEventBlock)

RCT_REMAP_VIEW_PROPERTY(html, HTML, NSString)
RCT_EXPORT_VIEW_PROPERTY(autoHeight, BOOL)

- (UIView *)view
{
    TextEditor *_view;

    _view = [[TextEditor alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
        NSLog(@"creating text editor $%@", _view);
    return _view;
}

- (NSArray *)customDirectEventTypes
{
    return @[
        @"changeLine",
        @"changeSelection",
        @"menuItemTapped",
    ];
}

@end