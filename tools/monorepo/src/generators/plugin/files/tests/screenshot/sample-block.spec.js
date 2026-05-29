import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'sample block visual regression', () => {
    const BLOCK_NAME = '<%= slug %>/sample-block';
    const BLOCK_CLASS = '.wp-block-<%= slug %>-sample-block';

    test.beforeEach( async ( { admin } ) => {
        await admin.createNewPost();
    } );

    test( 'default rendering', async ( { editor } ) => {
        await editor.insertBlock( { name: BLOCK_NAME } );

        const preview = ( await editor.openPreviewPage() )
            .locator( BLOCK_CLASS )
            .first();

        await expect( preview ).toBeVisible();
        await expect( preview ).toHaveScreenshot();
    } );
} );
