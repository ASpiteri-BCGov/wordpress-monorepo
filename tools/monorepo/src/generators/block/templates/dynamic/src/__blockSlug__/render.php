<?php
/**
 * Server render template for dynamic (server-rendered) blocks.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>
<p <?php echo get_block_wrapper_attributes(); ?>>
    <?php esc_html_e( '<%= blockTitle %> – hello from the dynamic (server-rendered) content!', '<%= pluginSlug %>' ); ?>
</p>
