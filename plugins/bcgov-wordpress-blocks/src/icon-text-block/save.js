import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import {
    getIconGlyphA11yProps,
    getIconWrapperA11yProps,
} from '../icon/icon-accessibility';
import { ICON_ALLOWLIST_MAP } from '../icon/icon-allowlist';
import { getIconWrapperClasses } from '../icon/icon-classes';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @param {Object} props            Save props.
 * @param {Object} props.attributes Persisted block attributes.
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
const save = ( { attributes = {} } = {} ) => {
    const { iconId, iconSize, layout } = attributes;
    const supportedLayouts = [ 'icon-left', 'icon-top' ];
    const normalizedLayout = supportedLayouts.includes( layout )
        ? layout
        : 'icon-left';
    const layoutClass = `is-layout-${ normalizedLayout }`;
    const selectedIcon = ICON_ALLOWLIST_MAP[ iconId ];

    const blockProps = useBlockProps.save( {
        className: `bcgov-wp-blocks-icon-text-block ${ layoutClass }`,
    } );

    return (
        <div { ...blockProps }>
            <div className="bcgov-wp-blocks-icon-text-block__layout-shell">
                <div
                    className={ `bcgov-wp-blocks-icon-text-block__icon-section ${ getIconWrapperClasses(
                        {
                            iconSize,
                        }
                    ) }` }
                    { ...getIconWrapperA11yProps( attributes, {
                        forSave: true,
                    } ) }
                >
                    { selectedIcon ? (
                        <i
                            className={ `bcgov-wp-blocks-icon__preview ${ selectedIcon.faClass }` }
                            { ...getIconGlyphA11yProps( attributes, {
                                forSave: true,
                            } ) }
                        />
                    ) : (
                        <span className="bcgov-wp-blocks-icon__preview">
                            { 'Icon placeholder' }
                        </span>
                    ) }
                </div>
                <div className="bcgov-wp-blocks-icon-text-block__text-section">
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
};

export default save;
