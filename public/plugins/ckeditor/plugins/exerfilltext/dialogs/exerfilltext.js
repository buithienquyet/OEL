// Our dialog definition.
CKEDITOR.dialog.add( 'exerfilltextDialog', function( editor ) {
	return {

		// Basic properties of the dialog window: title, minimum size.
		title: 'Điền từ vào chỗ trống',
		minWidth: 400,
		minHeight: 100,
		height: 100,

		// Dialog window content definition.
		contents: [	
			// Definition of the Advanced Settings dialog tab (page).
			{
				id: 'tab-main',
				label: 'Cụm từ',
				elements: [
					{
						// Another text field for the abbr element id.
						type: 'text',
						id: 'words',
						label: 'Cụm từ'
					}
				]
			}
		],

		onShow: function() {
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( element )
                element = element.getAscendant( 'input', true );

            if ( !element || element.getName() != 'input' ) {
                element = editor.document.createElement( 'input' );
                this.insertMode = true;
            }
            else
                this.insertMode = false;

            this.element = element;
            if ( !this.insertMode )
                this.setupContent( this.element );
        },


		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {

			const dialog = this;		
            const input = this.element;
						
			input.setAttribute('type','text');			
			input.setAttribute('data-text', dialog.getValueOf( 'tab-main', 'words' ))

            if ( this.insertMode )
				editor.insertElement(input);
			else
				this.commitContent(input);
		}
	};
});
