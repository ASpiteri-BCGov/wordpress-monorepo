import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( '<%= blockSlug %> visual regression', () => {
    const BLOCK_NAME = '<%= pluginSlug %>/<%= blockSlug %>';
    const BLOCK_CLASS = '.wp-block-<%= pluginSlug %>-<%= blockSlug %>';

    // Dockerized browser rendering can still differ slightly across environments.
    const SCREENSHOT_OPTIONS = { maxDiffPixelRatio: 0.02 };

    test.beforeEach( async ( { admin } ) => {
        await admin.createNewPost();
    } );

    test( 'default rendering', async ( { editor } ) => {
        await editor.insertBlock( { name: BLOCK_NAME } );

        const preview = ( await editor.openPreviewPage() )
            .locator( BLOCK_CLASS )
            .first();

        await expect( preview ).toBeVisible();
        await expect( preview ).toHaveScreenshot( SCREENSHOT_OPTIONS );
    } );
} );
