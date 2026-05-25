const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test( '<%= blockSlug %> block can be inserted and rendered on the frontend', async ( {
    admin,
    editor,
    page,
} ) => {
    const BLOCK_NAME = '<%= pluginSlug %>/<%= blockSlug %>';
    const BLOCK_CLASS = '.wp-block-<%= pluginSlug %>-<%= blockSlug %>';

    await admin.createNewPost();
    await editor.insertBlock( { name: BLOCK_NAME } );

    const block = editor.canvas.locator( `[data-type="${ BLOCK_NAME }"]` );
    await expect( block ).toBeVisible();

    const postId = await editor.publishPost();
    expect( postId ).not.toBeNull();

    await page.goto( `/?p=${ postId }` );

    const frontendBlock = page.locator( BLOCK_CLASS ).first();
    await expect( frontendBlock ).toBeVisible();
    await expect( frontendBlock ).toContainText(
        'hello from the saved content!'
    );
} );
