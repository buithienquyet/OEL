// Register the plugin within the editor.
CKEDITOR.plugins.add('exerfilltext', {

	// Register the icons.
	icons: 'exerfilltext',

	// The plugin initialization logic goes inside this method.
	init: function (editor) {

		// Define an editor command that opens our dialog window.
		editor.addCommand('exerfilltext', new CKEDITOR.dialogCommand('exerfilltextDialog'));

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('Exerfilltext', {

			// The text part of the button (if available) and the tooltip.
			label: 'Chèn ô điền từ',

			// The command to execute on click.
			command: 'exerfilltext',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'insert'
		});

		// Register our dialog file -- this.path is the plugin folder path.
		CKEDITOR.dialog.add('exerfilltextDialog', this.path + 'dialogs/exerfilltext.js');
	}
});
