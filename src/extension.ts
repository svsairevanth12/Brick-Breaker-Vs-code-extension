import * as vscode from 'vscode';
import { BrickBreakerPanel } from './brickBreakerPanel';

class BrickBreakerViewProvider implements vscode.TreeDataProvider<any> {
    constructor(private context: vscode.ExtensionContext) {}

    getTreeItem(element: any): vscode.TreeItem {
        const item = new vscode.TreeItem('🎮 Click to Play Brick Breaker!', vscode.TreeItemCollapsibleState.None);
        item.command = {
            command: 'brickBreaker.openGame',
            title: 'Open Brick Breaker Game'
        };
        item.tooltip = 'Start the Brick Breaker game';
        return item;
    }

    getChildren(element?: any): Thenable<any[]> {
        if (!element) {
            return Promise.resolve([{ label: 'game' }]);
        }
        return Promise.resolve([]);
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Brick Breaker extension is now active!');

    // Register the command to open the game
    const disposable = vscode.commands.registerCommand('brickBreaker.openGame', () => {
        BrickBreakerPanel.createOrShow(context.extensionUri);
    });

    // Register the view provider for the activity bar
    const viewProvider = new BrickBreakerViewProvider(context);
    vscode.window.registerTreeDataProvider('brickBreakerGameView', viewProvider);

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Brick Breaker extension is now deactivated!');
}
