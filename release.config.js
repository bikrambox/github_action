const { execSync } = require('child_process');
const { GitHub } = require('@octokit/rest');

module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    {
      // Custom plugin for uploading APK files as release assets
      async publish(pluginContext) {
        const { nextRelease, logger } = pluginContext;
        const github = new GitHub({ auth: process.env.PAT_TOKEN });

        // Upload APK files as release assets
        try {
          const apkPaths = ['./Duolingo_5.144.3_Beta_Unlocked_universal.apk', './Adguard-4.4.65-Nightly-Mod-www.ReXdl.com.apk']; // Update with your APK file paths
          for (const apkPath of apkPaths) {
            const assetName = apkPath.split('/').pop(); // Extract file name from path
            const { data } = await github.repos.uploadReleaseAsset({
              owner: process.env.REPO_OWNER,
              repo: process.env.REPO_NAME,
              release_id: nextRelease.gitTag,
              data: apkPath,
              name: assetName,
              headers: {
                'content-type': 'application/vnd.android.package-archive', // Specify content type for APK files
              },
            });
            logger.log(`Uploaded ${assetName} to release ${nextRelease.version}`);
          }
        } catch (error) {
          logger.error(`Failed to upload release assets: ${error.message}`);
          throw error;
        }
      },
    },
    '@semantic-release/github',
  ],
};





