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
  wp_enqueue_script( 'maplibregl-script',
    'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css'
  );
  wp_enqueue_script( 'maplibregl-style',
    'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js'
  );
}
add_action( 'wp_enqueue_scripts', 'rara_theme_enqueue_maplibregl' );

?>