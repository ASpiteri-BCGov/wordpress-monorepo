/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/* eslint-disable import/no-extraneous-dependencies -- @wordpress/components is provided in the monorepo workspace */
import {
    BaseControl,
    Button,
    PanelBody,
    SearchControl,
    SelectControl,
    TextControl,
    ToggleControl,
} from '@wordpress/components';
/* eslint-enable import/no-extraneous-dependencies */

/**
 * Internal dependencies
 */
import { getIconGlyphA11yProps } from './icon-accessibility';
import { getIconWrapperClasses, isDecorativeMode } from './icon-classes';
import { ICON_ALLOWLIST, ICON_ALLOWLIST_MAP } from './icon-allowlist';
import './editor.scss';

/**
 * The edit component for the Icon block.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Persisted attributes.
 * @param {Function} props.setAttributes Updates attributes.
 * @return {import('react').ReactElement} Block editor UI.
 */
const Edit = ( { attributes, setAttributes } ) => {
    const { iconId, iconSize, isDecorative, accessibleName } = attributes;
    const { useState } = wp.element;
    const [ iconQuery, setIconQuery ] = useState( '' );

    const selectedIcon = ICON_ALLOWLIST_MAP[ iconId ];

    const decorative = isDecorativeMode( isDecorative );

    const blockProps = useBlockProps( {
        className: getIconWrapperClasses( { iconSize } ),
    } );

    const sizeSelectOptions = [
        {
            value: 'small',
            label: __( 'Small', 'bcgov-wordpress-blocks' ),
        },
        {
            value: 'medium',
            label: __( 'Medium', 'bcgov-wordpress-blocks' ),
        },
        {
            value: 'large',
            label: __( 'Large', 'bcgov-wordpress-blocks' ),
        },
        {
            value: 'xlarge',
            label: __( 'XLarge', 'bcgov-wordpress-blocks' ),
        },
    ];
    const filteredIcons = ICON_ALLOWLIST.filter( ( option ) => {
        const query = iconQuery.trim().toLowerCase();
        if ( ! query ) {
            return true;
        }

        return (
            option.label.toLowerCase().includes( query ) ||
            option.id.toLowerCase().includes( query )
        );
    } );
    const totalIconCount = ICON_ALLOWLIST.length;
    const filteredIconCount = filteredIcons.length;

    let previewNode = (
        <span className="bcgov-wp-blocks-icon__preview">
            { __( 'Icon', 'bcgov-wordpress-blocks' ) }
        </span>
    );

    if ( selectedIcon ) {
        previewNode = (
            <i
                className={ `bcgov-wp-blocks-icon__preview ${ selectedIcon.faClass }` }
                { ...getIconGlyphA11yProps( attributes ) }
            />
        );
    }

    return (
        <>
            <InspectorControls>
                <PanelBody
                    title={ __( 'Icon', 'bcgov-wordpress-blocks' ) }
                    initialOpen
                >
                    <BaseControl
                        id="bcgov-wp-blocks-icon-search"
                        label={ __( 'Pick an icon', 'bcgov-wordpress-blocks' ) }
                        __nextHasNoMarginBottom
                    >
                        <SearchControl
                            __nextHasNoMarginBottom
                            value={ iconQuery }
                            onChange={ setIconQuery }
                            placeholder={ __(
                                'Search icons',
                                'bcgov-wordpress-blocks'
                            ) }
                        />
                        <p className="bcgov-wp-blocks-icon-picker-meta">
                            { sprintf(
                                /* translators: 1: number of shown icons, 2: total icons */
                                __(
                                    'Showing %1$d of %2$d icons',
                                    'bcgov-wordpress-blocks'
                                ),
                                filteredIconCount,
                                totalIconCount
                            ) }
                        </p>
                        <div className="bcgov-wp-blocks-icon-picker-list">
                            { filteredIcons.map( ( { id, label, faClass } ) => (
                                <Button
                                    key={ id }
                                    variant={
                                        iconId === id ? 'primary' : 'secondary'
                                    }
                                    className="bcgov-wp-blocks-icon-picker-item"
                                    onClick={ () =>
                                        setAttributes( { iconId: id } )
                                    }
                                >
                                    <i className={ faClass } aria-hidden />
                                    <span>{ label }</span>
                                </Button>
                            ) ) }
                        </div>
                        { 0 === filteredIconCount ? (
                            <p className="bcgov-wp-blocks-icon-picker-empty">
                                { __(
                                    'No icons match your search.',
                                    'bcgov-wordpress-blocks'
                                ) }
                            </p>
                        ) : null }
                    </BaseControl>
                    <SelectControl
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                        label={ __( 'Icon size', 'bcgov-wordpress-blocks' ) }
                        value={ iconSize }
                        options={ sizeSelectOptions }
                        onChange={ ( value ) =>
                            setAttributes( { iconSize: value } )
                        }
                    />
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( 'Decorative', 'bcgov-wordpress-blocks' ) }
                        help={ __(
                            'Decorative icons are hidden from assistive technology when implemented.',
                            'bcgov-wordpress-blocks'
                        ) }
                        checked={ decorative }
                        onChange={ ( value ) =>
                            setAttributes( { isDecorative: value } )
                        }
                    />
                    { ! decorative ? (
                        <TextControl
                            __next40pxDefaultSize
                            __nextHasNoMarginBottom
                            label={ __(
                                'Accessible name',
                                'bcgov-wordpress-blocks'
                            ) }
                            help={ __(
                                'Short description for screen readers when the icon is meaningful. Leave empty to use the icon’s picker label (e.g. Home).',
                                'bcgov-wordpress-blocks'
                            ) }
                            value={ accessibleName }
                            onChange={ ( value ) =>
                                setAttributes( { accessibleName: value } )
                            }
                            placeholder={
                                selectedIcon?.label ||
                                __(
                                    'Uses icon label if empty',
                                    'bcgov-wordpress-blocks'
                                )
                            }
                        />
                    ) : null }
                </PanelBody>
            </InspectorControls>
            <div { ...blockProps }>{ previewNode }</div>
        </>
    );
};

export default Edit;
