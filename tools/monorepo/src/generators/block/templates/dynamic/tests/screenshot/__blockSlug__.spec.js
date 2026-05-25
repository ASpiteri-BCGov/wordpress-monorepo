const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( '<%= blockSlug %> block', () => {
    test( 'should have no visual regressions', async ( { admin, page } ) => {
        await admin.createNewPost();
        await page.evaluate( () => {
            const el = document.createElement( 'div' );
            el.innerHTML = `<!-- wp:<%= pluginSlug %>/<%= blockSlug %> /-->`;
            document.body.appendChild( el );
        } );
        await expect( page ).toHaveScreenshot();
    } );
} );
