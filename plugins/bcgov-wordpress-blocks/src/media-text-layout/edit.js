import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
} from '@wordpress/block-editor';
/* eslint-disable import/no-extraneous-dependencies -- @wordpress packages are provided in the monorepo workspace */
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
/* eslint-enable import/no-extraneous-dependencies */

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

const TEMPLATE = [
    [ 'core/heading' ],
    [ 'core/paragraph' ],
    [ 'core/list' ],
    [ 'core/buttons' ],
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Persisted attributes.
 * @param {Function} props.setAttributes Updates attributes.
 * @return {Element} Element to render.
 */
const Edit = ( { attributes, setAttributes } ) => {
    const { imagePosition, imageId } = attributes;
    const media = useSelect(
        ( select ) => {
            if ( ! imageId ) {
                return null;
            }

            return select( coreStore ).getMedia( imageId );
        },
        [ imageId ]
    );
    const blockProps = useBlockProps( {
        className:
            'right' === imagePosition ? 'is-image-right' : 'is-image-left',
    } );

    return (
        <>
            <InspectorControls>
                <PanelBody title="Layout" initialOpen={ true }>
                    <ToggleControl
                        label="Image on right"
                        checked={ 'right' === imagePosition }
                        onChange={ ( value ) =>
                            setAttributes( {
                                imagePosition: value ? 'right' : 'left',
                            } )
                        }
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <div className="layout-shell">
                    <div className="wp-block-image">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ ( selectedMedia ) =>
                                    setAttributes( {
                                        imageId: selectedMedia?.id,
                                    } )
                                }
                                allowedTypes={ [ 'image' ] }
                                value={ imageId }
                                render={ ( { open } ) => (
                                    <button
                                        type="button"
                                        className="image-inner"
                                        onClick={ open }
                                    >
                                        { media && media.source_url ? (
                                            <img
                                                src={ media.source_url }
                                                alt={ media.alt_text || '' }
                                            />
                                        ) : (
                                            <div className="image-placeholder">
                                                Select Image
                                            </div>
                                        ) }
                                    </button>
                                ) }
                            />
                        </MediaUploadCheck>
                    </div>
                    <div className="inner-blocks">
                        <InnerBlocks
                            template={ TEMPLATE }
                            allowedBlocks={ TEMPLATE }
                            renderAppender={ InnerBlocks.ButtonBlockAppender }
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;
