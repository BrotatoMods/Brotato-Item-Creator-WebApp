const { createApp } = Vue

createApp({
	data() {
		return {
			// User options:
			tier: 1,
			name: 'My Item',
			type: 'Item',
			showImg: true,
			icon: 'Page',
			width: 300,
			statsText: [
				'[p]+8[/p] Max HP',
				'[n]-4%[/n] Dodge'
			].join('\n'),

			// Misc:
			widthMin: 200,
			widthDefault: 300,
			widthMax: 400,

			// Icons
			icons: {
				'Page' : 'info.png',
				'Question ': 'questionmark.png',
				'Character': 'character-base.png',
				'Character?': 'character-base-questionmark.png',
				'Artifact': 'sg/artifact.png',
				'Axe': 'sg/axe.png',
				'Ball': 'sg/ball.png',
				'Bomb': 'sg/bomb.png',
				'Book': 'sg/book.png',
				'Device': 'sg/device.png',
				'Gun1': 'sg/gun1.png',
				'Gun2': 'sg/gun2.png',
				'Ring': 'sg/ring.png',
			},

			// Saved Items
			myItems: this.getSavedItems(),
		}
	},
	methods: {
		getBgClasses() {
			return `rarity${this.tier} rarity${this.tier}dark`
		},
		getNameClass() {
			return `colorrarity${this.tier}`
		},
		applyTextColors( str = '' ) {
			//@todo: use obj + loop
			str = str.replaceAll( '[p]', '<span class="text-positive">' );
			str = str.replaceAll( '[n]', '<span class="text-negative">' );
			str = str.replaceAll( '[s]', '<span class="text-cream">' );
			str = str.replaceAll( '[/p]', '</span>' );
			str = str.replaceAll( '[/n]', '</span>' );
			str = str.replaceAll( '[/s]', '</span>' );
			str = str.replaceAll( '\n', '<br>' );
			return str;
		},
		getWidthInlineStyle() {
			return `width: ${this.width}px;`
		},
		setType(type) {
			this.type = type;

			if ( type === 'Limited' ) {
				this.type = "Limited (5)";
			}
		},
		setWidth(width) {
			this.width = width;
			this.fixWidthInput();
		},
		fixWidthInput() {
			if (this.width > this.widthMax) {
				this.width = this.widthMax;
			}

			if (this.width < this.widthMin) {
				this.width = this.widthMin;
			}
		},
		setTier(num) {
			this.tier = num;
		},
		getIconImgSrc(key) {
			return 'img/icons/' + this.icons[key];
		},
		setIcon(key) {
			this.icon = key;
		},



		// Saving + Loading
		// ============================================================================

		getItemStats() {
			return {
				tier: this.tier,
				name: this.name,
				type: this.type,
				showImg: this.showImg,
				icon: this.icon,
				width: this.width,
			}
		},
		getSavedItems() {
			const storageItems = localStorage.getItem('my_items');
			if (!storageItems) {
				return [];
			}
			const storageItemsParsed = JSON.parse(storageItems);
			console.log({'Saved Items':storageItemsParsed});
			return storageItemsParsed;
		},
		saveItem() {
			this.myItems.push(this.getItemStats())
			this.saveStorageItems();
		},
		saveStorageItems() {
			localStorage.setItem('my_items', JSON.stringify(this.myItems));
		},
		loadItem(itemIndex) {
			const itemData = this.myItems[itemIndex];
			this.tier = itemData.tier;
			this.name = itemData.name;
			this.type = itemData.type;
			this.showImg = itemData.showImg;
			this.icon = itemData.icon;
			this.width = itemData.width;
		},
		deleteItem(itemIndex) {
			this.myItems.splice(itemIndex, 1);
			this.saveStorageItems();
		},


		// Stats
		// ============================================================================

		addStatLine(type = '') {
			var lb   = ( !this.statsText.length ) ? '' : '\n';
			var el   = '';
			var sign = '';
			var text1 = '';
			var text2 = '';

			switch( type )
			{
				case 'positive':
					el    = 'p';
					sign  = '+';
					text1 = 'VALUE';
					text2 = 'STAT';
					break;

				case 'negative':
					el    = 'n';
					sign  = '-';
					text1 = 'VALUE';
					text2 = 'STAT';
					break;

				case 'stat':
					el    = 's';
					sign  = '';
					text1 = 'Damage:';
					text2 = '30';
					break;
			}

			this.statsText += `${lb}` + `[${el}]${sign}${text1}[/${el}] ${text2}`;
		},
		getStatsText() {
			return this.applyTextColors(this.statsText);
		},
		clearStats() {
			this.statsText = '';
		},



		// Canvas + Saving
		// ============================================================================

		renderCanvas() {
			const canvas = document.getElementById('canvas');
			const context = canvas.getContext('2d');
			const result = document.getElementById('result');
			const ibox = result.querySelector('.ibox');

			// Update canvas dimensions, based on .ibox
			canvas.setAttribute( 'width', ibox.offsetWidth );
			canvas.setAttribute( 'height', ibox.offsetHeight );

			const resultDupe = result.cloneNode(true);
			const resultTemp = document.getElementById('result-temp');

			// Using `computedStyleToInlineStyle` only seems to work if the
			// element is part of the DOM, ie. visible on the page
			resultTemp.appendChild(resultDupe);

			// Apply inline styles
			// We need to do this because the DOM -> Canvas conversion
			//   only uses the stuff within the element itself, so it can't
			//   apply styles via the stylesheet, because it was declared
			//   outside of the element
			computedStyleToInlineStyle(resultDupe, {
				recursive: true,
			});

			// Render Canvas
			const resultHtml = resultDupe.innerHTML;

			// We don't need the temp element any more, we only needed its HTML
			// (with all the inline stuff)
			resultTemp.removeChild(resultDupe);

			// console.log(resultHtml);

			rasterizeHTML.drawHTML(resultHtml).then(function (renderResult) {
				console.log({renderResult});
				// The -8px accounts for browsers adding margins by default to body, ie: `body {margin: 8px}`
				context.drawImage(renderResult.image, -8, -8);
			});
		},
	}
}).mount('#app')
