<?php
/**
 * RARA functions and definitions
 */

/*
 * Enqueue parent and child theme styles
 */
function rara_theme_enqueue_styles() {
  $parent_style = 'astra';
  wp_enqueue_style( $parent_style,
    get_template_directory_uri() . '/style.css' );
  wp_enqueue_style( 'child-style',
    get_stylesheet_directory_uri() . '/style.css',
    array( $parent_style ),
    wp_get_theme()->get('Version')
  );
}
add_action( 'wp_enqueue_scripts', 'rara_theme_enqueue_styles' );

/*
 * Enqueue MapLibre GL JS
 */
function rara_theme_enqueue_maplibregl() {
  $turf_version = '6.5.0';
  $maplibregl_version = '5.13.0';

  wp_enqueue_script( 'turf',
    'https://unpkg.com/@turf/turf@' . $turf_version . '/turf.min.js'
  );

  wp_enqueue_style( 'maplibregl',
    'https://unpkg.com/maplibre-gl@' . $maplibregl_version . '/dist/maplibre-gl.css'
  );

  wp_enqueue_script( 'maplibregl',
    'https://unpkg.com/maplibre-gl@' . $maplibregl_version . '/dist/maplibre-gl.js'
  );
}

/*
 * Enqueue custom scripts and styles
 */
function rara_theme_enqueue_custom() {
  $obj = get_queried_object();

  if (isset($obj->post_name)) {
    $slug = $obj->post_name;

    if (strpos($slug, 'explore') === 0) {
      rara_theme_enqueue_maplibregl();
    }
  }
}
add_action( 'wp_enqueue_scripts', 'rara_theme_enqueue_custom' );

?>