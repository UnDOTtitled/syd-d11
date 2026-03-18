<?php

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Include the Pantheon-specific settings file.
 *
 * n.b. The settings.pantheon.php file makes some changes
 *      that affect all environments that this site
 *      exists in.  Always include this file, even in
 *      a local development environment, to ensure that
 *      the site settings remain consistent.
 */
include __DIR__ . "/settings.pantheon.php";

// Pantheon should always use built Vite assets. Leaving this on the default
// "auto" mode causes request-time checks against a local dev server URL,
// which can block PHP workers and lead to 504s.
if (isset($_ENV['PANTHEON_ENVIRONMENT'])) {
  $settings['vite']['useDevServer'] = FALSE;
}

/**
 * Skipping permissions hardening will make scaffolding
 * work better, but will also raise a warning when you
 * install Drupal.
 *
 * https://www.drupal.org/project/drupal/issues/3091285
 */
// $settings['skip_permissions_hardening'] = TRUE;
$settings['config_sync_directory'] = '../config/sync';

// Automatically generated include for settings managed by ddev.
$ddev_settings = __DIR__ . '/settings.ddev.php';
if (getenv('IS_DDEV_PROJECT') == 'true' && is_readable($ddev_settings)) {
  require $ddev_settings;
}

/**
 * If there is a local settings file, then include it (after DDEV so local overrides).
 */
$local_settings = __DIR__ . "/settings.local.php";
if (file_exists($local_settings)) {
  include $local_settings;
}
