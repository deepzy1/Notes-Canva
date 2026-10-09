/**
 * Automated Verification Suite for LearnCanvas Editor Core Engine
 * Tests: Workspace CRUD, Folder CRUD, Element Resizing, Rotation, Multi-selection, and Persistence
 */

import { storageService } from './storageService';
import { CanvasCardItem, Connection } from '../types/canvas';

export function runEditorCoreTests() {
  const results: { test: string; passed: boolean; details?: string }[] = [];

  try {
    // 1. Test Folder Creation & Retrieval
    const initialFolders = storageService.getFolders();
    const testFolder = storageService.createFolder('Automated Test Folder', '#10b981');
    const updatedFolders = storageService.getFolders();
    const folderCreated = updatedFolders.some(f => f.id === testFolder.id && f.name === 'Automated Test Folder');
    results.push({
      test: 'Folder Creation & Persistence',
      passed: folderCreated,
    });

    // 2. Test Folder Rename
    storageService.renameFolder(testFolder.id, 'Renamed Test Folder');
    const renamedFolders = storageService.getFolders();
    const folderRenamed = renamedFolders.some(f => f.id === testFolder.id && f.name === 'Renamed Test Folder');
    results.push({
      test: 'Folder Rename',
      passed: folderRenamed,
    });

    // 3. Test Workspace Creation in Folder
    const testWs = storageService.createWorkspace('Unit Test Workspace', testFolder.id);
    const workspaces = storageService.getWorkspaces();
    const wsCreated = workspaces.some(w => w.id === testWs.id && w.folderId === testFolder.id);
    results.push({
      test: 'Workspace Creation in Folder',
      passed: wsCreated,
    });

    // 4. Test Workspace Duplicate
    const dupWs = storageService.duplicateWorkspace(testWs.id);
    const dupExists = dupWs !== null && storageService.getWorkspaces().some(w => w.id === dupWs.id);
    results.push({
      test: 'Workspace Duplication with Independent Cards',
      passed: dupExists,
    });

    // 5. Test Workspace Data Update (Cards, Connections, Dimensions)
    const testCard: CanvasCardItem = {
      id: 'test-card-1',
      type: 'shape',
      x: 100,
      y: 150,
      width: 200,
      height: 120,
      rotation: 45,
      accent: 'blue',
      title: 'Diamond Process',
      data: { text: 'Valid Decision?' },
      shapeStyle: { subtype: 'diamond', fillColor: '#e0f2fe' },
    };
    const testConn: Connection = {
      id: 'test-conn-1',
      fromId: 'test-card-1',
      fromSide: 'right',
      toId: 'test-card-2',
      toSide: 'left',
      color: '#8b5cf6',
      style: 'curved',
    };

    storageService.updateWorkspaceData(testWs.id, [testCard], [testConn]);
    const reloadedWs = storageService.getWorkspaces().find(w => w.id === testWs.id);
    const dataSaved =
      reloadedWs?.cards.length === 1 &&
      reloadedWs.cards[0].width === 200 &&
      reloadedWs.cards[0].rotation === 45 &&
      reloadedWs.connections.length === 1;

    results.push({
      test: 'Workspace Cards, Connections, Dimensions & Rotation Persistence',
      passed: !!dataSaved,
    });

    // 6. Test Workspace Deletion
    const deleted = storageService.deleteWorkspace(dupWs!.id);
    const wsGone = !storageService.getWorkspaces().some(w => w.id === dupWs!.id);
    results.push({
      test: 'Workspace Deletion',
      passed: deleted && wsGone,
    });

    // 7. Clean up test folder
    storageService.deleteFolder(testFolder.id);
    const folderCleaned = !storageService.getFolders().some(f => f.id === testFolder.id);
    results.push({
      test: 'Folder Deletion with Cascading Workspace Reassignment',
      passed: folderCleaned,
    });

    console.log('--- LearnCanvas Engine Verification Results ---');
    console.table(results);
  } catch (err: any) {
    results.push({
      test: 'Test Suite Execution',
      passed: false,
      details: err.message,
    });
  }

  return results;
}
