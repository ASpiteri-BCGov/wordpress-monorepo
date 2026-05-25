import {
    formatFiles,
    generateFiles,
    readProjectConfiguration,
    Tree,
} from '@nx/devkit';
import * as path from 'path';
import { slugify, toTitle } from '../helpers';
import { BlockGeneratorSchema } from './schema';

const normalizePluginProjectName = ( plugin: string ) =>
    plugin.replace( /^plugins\//, '' ).replace( /\/$/, '' );

/**
 * Generates a WordPress block in an existing plugin project.
 * @param {Tree}                 tree    Filesystem tree.
 * @param {BlockGeneratorSchema} options Options from schema.json.
 */
export const blockGenerator = async (
    tree: Tree,
    options: BlockGeneratorSchema
) => {
    const blockSlug = slugify( options.name );
    const pluginName = normalizePluginProjectName( options.plugin );

    if ( ! blockSlug ) {
        throw new Error(
            'Block name must contain at least one alphanumeric character.'
        );
    }

    const pluginConfig = readProjectConfiguration( tree, pluginName );
    if (
        ! pluginConfig.root?.startsWith( 'plugins/' ) ||
        ! pluginConfig.sourceRoot?.startsWith( `${ pluginConfig.root }/src` )
    ) {
        throw new Error(
            `Project "${ pluginName }" is not a block plugin project under plugins/.`
        );
    }

    const pluginSlug = pluginConfig.root.replace( /^plugins\//, '' );
    const blockRoot = `${ pluginConfig.root }/src/${ blockSlug }`;
    const blockJsonPath = `${ blockRoot }/block.json`;

    if ( tree.exists( blockJsonPath ) ) {
        throw new Error(
            `Block "${ blockSlug }" already exists in plugin "${ pluginSlug }".`
        );
    }

    // Select template folder based on variant.
    // Each template (static/dynamic) is self-contained with all required files.
    const variant = options.variant || 'dynamic';
    const templateDir = path.join(
        __dirname,
        'templates',
        'static' === variant ? 'static' : 'dynamic'
    );

    generateFiles( tree, templateDir, pluginConfig.root, {
        pluginSlug,
        blockSlug,
        blockTitle: toTitle( blockSlug ),
        blockDescription: '',
    } );

    await formatFiles( tree );
};

export default blockGenerator;
