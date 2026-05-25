import { getProjects, Tree, logger } from '@nx/devkit';
import { execFileSync } from 'child_process';
import { ReleaseTagGeneratorSchema } from './schema';

/**
 * Composer-compatible semver regex.
 * Matches: MAJOR.MINOR.PATCH[-prerelease][+build]
 */
const SEMVER_REGEX =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const releaseTagGenerator = async (
    tree: Tree,
    options: ReleaseTagGeneratorSchema
) => {
    const { project } = options;
    const push = options.push ?? true;

    // Strip a leading "v" so the user can type either "1.2.3" or "v1.2.3".
    const version = options.version.replace( /^v/, '' );
    const tag = `${ project }/v${ version }`;

    // --- Validate project exists in workspace ---
    const projects = getProjects( tree );
    if ( ! projects.has( project ) ) {
        const available = [ ...projects.keys() ].sort().join( ', ' );
        throw new Error(
            `Project "${ project }" was not found in the workspace.\n` +
                `Available projects: ${ available }`
        );
    }

    // --- Validate semver ---
    if ( ! SEMVER_REGEX.test( version ) ) {
        throw new Error(
            `"${ version }" is not a valid Composer-compatible semantic version.\n` +
                `Expected format: MAJOR.MINOR.PATCH (e.g. 1.2.3, 1.2.3-beta.1, 1.2.3+build.42)`
        );
    }

    logger.info( `Creating tag: ${ tag }` );

    execFileSync( 'git', [ 'tag', tag ], { stdio: 'inherit' } );

    if ( push ) {
        logger.info( `Pushing tag ${ tag } to origin...` );
        execFileSync( 'git', [ 'push', 'origin', tag ], { stdio: 'inherit' } );
    } else {
        logger.info(
            `Tag created locally. Run \`git push origin "${ tag }"\` to publish it.`
        );
    }
};

export default releaseTagGenerator;
