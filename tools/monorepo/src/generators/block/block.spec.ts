import { addProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { pluginGenerator } from '../plugin/plugin';
import { blockGenerator } from './block';
import { BlockGeneratorSchema } from './schema';

describe( 'block generator', () => {
    let tree: Tree;

    beforeEach( async () => {
        tree = createTreeWithEmptyWorkspace();
        await pluginGenerator( tree, {
            name: 'Test Plugin',
            wpEnvPort: 9002,
            description: 'Description',
        } );
    } );

    it( 'should scaffold a block under an existing plugin', async () => {
        const options: BlockGeneratorSchema = {
            plugin: 'test-plugin',
            name: 'Hero Banner',
        };

        await blockGenerator( tree, options );

        const blockJsonPath = 'plugins/test-plugin/src/hero-banner/block.json';
        const e2ePath = 'plugins/test-plugin/tests/e2e/hero-banner.spec.js';
        const screenshotPath =
            'plugins/test-plugin/tests/screenshot/hero-banner.spec.js';

        expect( tree.exists( blockJsonPath ) ).toBe( true );
        expect( tree.exists( e2ePath ) ).toBe( true );
        expect( tree.exists( screenshotPath ) ).toBe( true );

        const blockJson = JSON.parse( tree.read( blockJsonPath )!.toString() );
        expect( blockJson.name ).toBe( 'test-plugin/hero-banner' );
        expect( blockJson.title ).toBe( 'Hero Banner' );
        expect( blockJson.description ).toBe( '' );
    } );

    it( 'should throw when plugin does not exist', async () => {
        await expect(
            blockGenerator( tree, {
                plugin: 'missing-plugin',
                name: 'new-block',
            } )
        ).rejects.toThrow();
    } );

    it( 'should throw when the block already exists', async () => {
        await blockGenerator( tree, {
            plugin: 'test-plugin',
            name: 'hero-banner',
        } );

        await expect(
            blockGenerator( tree, {
                plugin: 'test-plugin',
                name: 'hero-banner',
            } )
        ).rejects.toThrow( 'already exists' );
    } );

    it( 'should accept a plugin path under plugins/', async () => {
        await blockGenerator( tree, {
            plugin: 'plugins/test-plugin',
            name: 'Card Grid',
        } );

        expect(
            tree.exists( 'plugins/test-plugin/src/card-grid/block.json' )
        ).toBe( true );
    } );

    it( 'should throw when project is not a plugin project', async () => {
        addProjectConfiguration( tree, 'not-a-plugin', {
            root: 'packages/not-a-plugin',
            sourceRoot: 'packages/not-a-plugin/src',
            projectType: 'library',
            targets: {},
        } );

        await expect(
            blockGenerator( tree, {
                plugin: 'not-a-plugin',
                name: 'new-block',
            } )
        ).rejects.toThrow( 'not a block plugin project' );
    } );
} );
