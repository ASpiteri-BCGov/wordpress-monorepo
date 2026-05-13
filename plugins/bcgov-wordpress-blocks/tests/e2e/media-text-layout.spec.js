import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import path from 'node:path';

// Constants and shared test data.
const BLOCK_NAME = 'bcgov-wordpress-blocks/media-text-layout';
const BLOCK_CLASS = '.wp-block-bcgov-wordpress-blocks-media-text-layout';
const IMAGE_PATH = path.join( __dirname, '../../assets/images/square-512.png' );
const CONTENT = {
    heading: 'Media & Text Layout',
    list: 'list item',
    button: 'CTA Link Button',
};
const VIEWPORTS = {
    mobile: { width: 390, height: 844 },
    desktop: { width: 1400, height: 900 },
};
const WIDTH_CONSTRAINTS = {
    mobileMin: 328,
    mobileMax: 689,
    desktopMin: 690,
    desktopMax: 1120,
};

// Locator helpers.
const getEditorBlock = ( editor ) =>
    editor.canvas.locator( `[data-type="${ BLOCK_NAME }"]` ).first();

const getEditorFields = ( editor ) => {
    return {
        heading: editor.canvas
            .getByRole( 'document', { name: 'Block: Heading' } )
            .first(),
        list: editor.canvas
            .getByRole( 'textbox', { name: 'List text' } )
            .first(),
        button: editor.canvas
            .getByRole( 'textbox', { name: 'Button text' } )
            .first(),
    };
};

// Content helpers.
const assertVisibleAndFill = async ( field, value ) => {
    await expect( field ).toBeVisible();
    await field.fill( value );
};

const fillEditorContent = async ( editor, content ) => {
    const fields = getEditorFields( editor );

    await assertVisibleAndFill( fields.heading, content.heading );
    await assertVisibleAndFill( fields.list, content.list );
    await assertVisibleAndFill( fields.button, content.button );
};

const assertEditorContent = async ( editor, content ) => {
    const fields = getEditorFields( editor );

    await expect( fields.heading ).toContainText( content.heading );
    await expect( fields.list ).toContainText( content.list );
    await expect( fields.button ).toContainText( content.button );
};

// Assertion helpers.
const assertOrientationClass = async ( target, orientationClass ) => {
    await expect( target ).toHaveClass( new RegExp( orientationClass ) );
};

// Preview helpers.
const withPreviewBlock = async ( editor, action ) => {
    const previewPage = await editor.openPreviewPage();

    try {
        const previewBlock = previewPage.locator( BLOCK_CLASS ).first();
        await expect( previewBlock ).toBeVisible();
        await action( previewPage, previewBlock );
    } finally {
        await previewPage.close();
    }
};

// Editor interaction helpers.
const ensurePanelExpanded = async ( button, expandedState ) => {
    if ( expandedState !== ( await button.getAttribute( 'aria-expanded' ) ) ) {
        await button.click();
    }
};

const toggleImageOnRight = async ( editor ) => {
    await editor.page
        .locator( '.block-editor-block-breadcrumb' )
        .getByText( CONTENT.heading )
        .first()
        .click();

    const settingsButton = editor.page
        .getByRole( 'button', { name: 'Settings' } )
        .first();
    await ensurePanelExpanded( settingsButton, 'true' );

    const layoutPanelButton = editor.page
        .getByRole( 'button', { name: 'Layout' } )
        .first();
    await ensurePanelExpanded( layoutPanelButton, 'true' );

    const imageOnRightToggle = editor.page
        .locator( '.components-toggle-control', {
            hasText: 'Image on right',
        } )
        .locator( 'input[type="checkbox"]' )
        .first();
    await expect( imageOnRightToggle ).toBeVisible();
    await imageOnRightToggle.check();
};

// Render measurement helpers.
const getShellMetrics = async ( shell ) => {
    return shell.evaluate( ( element ) => {
        const computed = window.getComputedStyle( element );

        return {
            minWidthPx: parseFloat( computed.minWidth ),
            maxWidthPx: parseFloat( computed.maxWidth ),
            renderedWidthPx: element.getBoundingClientRect().width,
        };
    } );
};

const getRenderedWidth = async ( shell ) => {
    return shell.evaluate(
        ( element ) => element.getBoundingClientRect().width
    );
};

test.describe( 'media-text-layout block', () => {
    /**
     * Set up a new post with the media-text-layout block and fill in content before each test.
     */
    test.beforeEach( async ( { admin, editor, requestUtils } ) => {
        await requestUtils.deleteAllPosts();
        await admin.createNewPost();

        // Upload media and insert block with image attribute
        const media = await requestUtils.uploadMedia( IMAGE_PATH );
        await editor.insertBlock( {
            name: BLOCK_NAME,
            attributes: { imageId: media.id },
        } );

        await fillEditorContent( editor, CONTENT );
    } );

    test( 'Verify the block renders filled content and preview on desktop/mobile', async ( {
        editor,
    } ) => {
        const block = getEditorBlock( editor );
        await expect( block ).toBeVisible();
        await assertOrientationClass( block, 'is-image-left' );
        await assertEditorContent( editor, CONTENT );

        await withPreviewBlock(
            editor,
            async ( _previewPage, previewBlock ) => {
                await assertOrientationClass( previewBlock, 'is-image-left' );
            }
        );
    } );

    test( 'Verify the block toggles image to right in editor and preview', async ( {
        editor,
    } ) => {
        const block = getEditorBlock( editor );
        await expect( block ).toBeVisible();
        await assertOrientationClass( block, 'is-image-left' );

        await toggleImageOnRight( editor );
        await assertOrientationClass( block, 'is-image-right' );

        await withPreviewBlock(
            editor,
            async ( _previewPage, previewBlock ) => {
                await assertOrientationClass( previewBlock, 'is-image-right' );
            }
        );
    } );

    test( 'Verify the block renders with the correct width constraints', async ( {
        editor,
    } ) => {
        await withPreviewBlock( editor, async ( previewPage, previewBlock ) => {
            // Validate mobile constraints first.
            await previewPage.setViewportSize( VIEWPORTS.mobile );

            const shell = previewBlock.locator( '.layout-shell' ).first();
            await expect( shell ).toBeVisible();

            const mobileRenderedWidthPx = await getRenderedWidth( shell );
            expect( mobileRenderedWidthPx ).toBeGreaterThanOrEqual(
                WIDTH_CONSTRAINTS.mobileMin
            );
            expect( mobileRenderedWidthPx ).toBeLessThanOrEqual(
                WIDTH_CONSTRAINTS.mobileMax
            );

            // Then validate desktop constraints.
            await previewPage.setViewportSize( VIEWPORTS.desktop );

            const { minWidthPx, maxWidthPx, renderedWidthPx } =
                await getShellMetrics( shell );

            expect( minWidthPx ).toBe( WIDTH_CONSTRAINTS.desktopMin );
            expect( maxWidthPx ).toBe( WIDTH_CONSTRAINTS.desktopMax );
            expect( renderedWidthPx ).toBeLessThanOrEqual( maxWidthPx );
            expect( renderedWidthPx ).toBeGreaterThanOrEqual( minWidthPx );
        } );
    } );
} );
