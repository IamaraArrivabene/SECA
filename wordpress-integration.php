<?php
/**
 * Template Name: SECA Custom HTML Template
 * 
 * This template can be used to integrate custom HTML pages into WordPress
 * It loads the custom HTML content while maintaining WordPress header and footer if desired
 */

// Get template parameters
$use_wp_header = get_field('use_wp_header') ?? false;
$use_wp_footer = get_field('use_wp_footer') ?? false;
$html_file = get_field('html_file');
$include_wp_seo = get_field('include_wp_seo') ?? true;

// Start output buffering to capture the HTML content
ob_start();

// If we're including WordPress SEO (recommended for better SEO)
if ($include_wp_seo) {
    // Let WordPress handle the <head> section for SEO benefits
    remove_action('wp_head', 'rel_canonical');
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');
} else {
    // Prevent WordPress from adding its own stuff to the head
    remove_all_actions('wp_head');
    add_action('wp_head', function() {
        echo '<!-- WordPress head stripped for custom HTML -->';
    });
}

// If using WordPress header
if ($use_wp_header) {
    get_header();
} 

// Check if an HTML file was specified
if (!empty($html_file)) {
    // Get the file path from the specified URL or path
    $file_path = ABSPATH . str_replace(home_url(), '', $html_file);
    
    // Load the HTML content
    if (file_exists($file_path)) {
        $html_content = file_get_contents($file_path);
        
        // If not using WordPress header/footer, extract the <body> content 
        if (!$use_wp_header && !$use_wp_footer) {
            // Extract just the body content
            preg_match('/<body[^>]*>(.*?)<\/body>/is', $html_content, $matches);
            if (isset($matches[1])) {
                echo $matches[1];
            } else {
                echo $html_content;
            }
        } else {
            // If using WordPress header/footer, extract content between them
            preg_match('/<body[^>]*>(.*?)<\/body>/is', $html_content, $matches);
            if (isset($matches[1])) {
                // Skip header if using WordPress header
                if ($use_wp_header) {
                    // Find where the real content begins (after the header)
                    if (preg_match('/<header.*?<\/header>/is', $matches[1], $header_matches)) {
                        $content_after_header = preg_replace('/<header.*?<\/header>/is', '', $matches[1], 1);
                        echo $content_after_header;
                    } else {
                        echo $matches[1];
                    }
                } else {
                    echo $matches[1];
                }
            } else {
                echo $html_content;
            }
        }
    } else {
        echo '<div class="error-message">HTML file not found: ' . esc_html($file_path) . '</div>';
    }
} else {
    // Default content - this will show if no HTML file is specified
    ?>
    <div class="custom-html-container">
        <h1>SECA - Environmental and Climatic Studies System</h1>
        <p>Please specify an HTML file in the page settings.</p>
    </div>
    <?php
}

// If using WordPress footer
if ($use_wp_footer) {
    get_footer();
}

// Get the final output
$output = ob_get_clean();

// Process the output to add WordPress integration
echo $output;

// Add script to expose WordPress data to JavaScript if we're in WordPress
?>
<script>
    // Create a global wp object to flag that we're in WordPress
    var wp = {
        // Add WordPress environment info
        site_url: '<?php echo esc_js(site_url()); ?>',
        home_url: '<?php echo esc_js(home_url()); ?>',
        rest_url: '<?php echo esc_js(rest_url()); ?>',
        ajax_url: '<?php echo esc_js(admin_url('admin-ajax.php')); ?>',
        nonce: '<?php echo esc_js(wp_create_nonce('wp_rest')); ?>',
        
        // Add current post info if available
        <?php if (is_singular()) : ?>
        current_post: {
            id: <?php echo get_the_ID(); ?>,
            title: '<?php echo esc_js(get_the_title()); ?>',
            permalink: '<?php echo esc_js(get_permalink()); ?>'
        },
        <?php endif; ?>
        
        // Add language info if using a multilingual plugin
        <?php if (function_exists('pll_current_language')) : ?>
        language: '<?php echo esc_js(pll_current_language()); ?>',
        <?php elseif (defined('ICL_LANGUAGE_CODE')) : ?>
        language: '<?php echo esc_js(ICL_LANGUAGE_CODE); ?>',
        <?php else : ?>
        language: '<?php echo esc_js(get_locale()); ?>',
        <?php endif; ?>
    };
    
    // Initialize language handling
    document.addEventListener('DOMContentLoaded', function() {
        // Try to initialize the language switcher if present
        if (typeof initLanguageSwitcher === 'function') {
            initLanguageSwitcher();
        }
        
        // Get any WordPress-specific blog content
        const latestPosts = document.querySelector('.latest-posts');
        if (latestPosts && typeof wordpressAPI !== 'undefined') {
            // Load posts from WordPress
            wordpressAPI.getPosts().then(posts => {
                // Update UI with WordPress posts
                console.log('WordPress posts loaded:', posts.length);
            }).catch(error => {
                console.error('Failed to load WordPress posts:', error);
            });
        }
    });
</script>

<?php
/**
 * How to use this template:
 * 
 * 1. Upload this file to your WordPress theme directory
 * 2. Create a new page in WordPress
 * 3. Select "SECA Custom HTML Template" as the template
 * 4. Add custom fields to the page:
 *    - html_file: The path to your HTML file (relative to WordPress root)
 *    - use_wp_header: true/false whether to use WordPress header
 *    - use_wp_footer: true/false whether to use WordPress footer
 *    - include_wp_seo: true/false whether to allow WordPress SEO plugins to work
 * 
 * You can also add these instructions to your functions.php:
 * 
 * // Register ACF fields for the custom HTML template
 * if (function_exists('acf_add_local_field_group')) {
 *     acf_add_local_field_group([
 *         'title' => 'Custom HTML Settings',
 *         'fields' => [
 *             [
 *                 'key' => 'field_html_file',
 *                 'label' => 'HTML File',
 *                 'name' => 'html_file',
 *                 'type' => 'text',
 *                 'instructions' => 'Enter the path to your HTML file (relative to WordPress root)',
 *                 'required' => 1,
 *             ],
 *             [
 *                 'key' => 'field_use_wp_header',
 *                 'label' => 'Use WordPress Header',
 *                 'name' => 'use_wp_header',
 *                 'type' => 'true_false',
 *                 'instructions' => 'Enable to use the WordPress theme header',
 *                 'default_value' => 0,
 *             ],
 *             [
 *                 'key' => 'field_use_wp_footer',
 *                 'label' => 'Use WordPress Footer',
 *                 'name' => 'use_wp_footer',
 *                 'type' => 'true_false',
 *                 'instructions' => 'Enable to use the WordPress theme footer',
 *                 'default_value' => 0,
 *             ],
 *             [
 *                 'key' => 'field_include_wp_seo',
 *                 'label' => 'Include WordPress SEO',
 *                 'name' => 'include_wp_seo',
 *                 'type' => 'true_false',
 *                 'instructions' => 'Enable to allow WordPress SEO plugins to work',
 *                 'default_value' => 1,
 *             ],
 *         ],
 *         'location' => [
 *             [
 *                 [
 *                     'param' => 'page_template',
 *                     'operator' => '==',
 *                     'value' => 'wordpress-integration.php',
 *                 ],
 *             ],
 *         ],
 *     ]);
 * }
 */ 