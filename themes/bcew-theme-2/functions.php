<?php
/**
 * Theme functions and definitions
 *
 * @package BcewTheme2
 */

/**
 * Disables the default patterns from WordPress.
 */
function bcew_disable_default_block_patterns() {
    remove_theme_support( 'core-block-patterns' );
}
add_action( 'init', 'bcew_disable_default_block_patterns' );


/**
 * Load Composer autoloader and verify required class exists.
 * If the autoloader or the required class is missing, halt plugin execution.
 */
$autoloader_path = __DIR__ . '/vendor/autoload.php';
if ( file_exists( $autoloader_path ) ) {
    require_once $autoloader_path;
}

/**
 * Enable appearance tools for super admins only.
 *
 * @param WP_Theme_JSON_Data $theme_json Theme JSON data object.
 *
 * @return WP_Theme_JSON_Data
 */
function extended_web_enable_appearance_tools_for_super_admins( $theme_json ) {
    if ( ! is_super_admin() ) {
        return $theme_json;
    }

    return $theme_json->update_with(
        array(
            'version'  => 3,
            'settings' => array(
                'appearanceTools' => true,
            ),
        )
    );
}
add_filter( 'wp_theme_json_data_theme', 'extended_web_enable_appearance_tools_for_super_admins', 20 );

/**
 * Restrict access to the locking UI to Administrators.
 *
 * @param array $settings Default editor settings.
 */
function bcew_restrict_locking_unlocking_blocks( $settings ) {
    $settings['canLockBlocks'] = current_user_can( 'activate_plugins' );
    return $settings;
}
add_filter( 'block_editor_settings_all', 'bcew_restrict_locking_unlocking_blocks', 10, 2 );


/**
 * Registers the post title block styles (e.g. Underline).
 *
 * @since 1.0.0
 */
function bcew_register_post_title_block_styles() {
	$block_name       = 'core/post-title';
	$style_properties = array(
		'name'         => 'underline-title',
		'label'        => __( 'Underline' ),
		'isDefault'    => false,
		'style_handle' => 'bc-extended-web-theme-styles',
	);
	register_block_style( $block_name, $style_properties );
}
add_action( 'init', 'bcew_register_post_title_block_styles' );
