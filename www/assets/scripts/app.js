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

			// GUI options
			showSidebar: false,

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
				'Asteroid': 'sg/Asteroid.png',
				'Lava_Balls': 'sg/Lava_Balls.png',
				'Spicy_Food': 'sg/Spicy_Food.png',
				'Empty': 'empty.png',
			},

			// Default Text
			defaultWeaponTextMelee: [
				'[s]Damage[/s]: 10 (50% [i]melee[/i])',
				'[s]Critical[/s]: x2 (3% chance)',
				'[s]Cooldown[/s]: 0.7s',
				'[s]Knockback[/s]: 10',
				'[s]Range[/s]: 300 (Melee)',
			].join('\n'),
			defaultWeaponTextRanged: [
				'[s]Damage[/s]: 10 (50% [i]ranged[/i])',
				'[s]Critical[/s]: x1.5 (3% chance)',
				'[s]Cooldown[/s]: 0.7s',
				'[s]Knockback[/s]: 10',
				'[s]Range[/s]: 500 (Ranged)',
				'[s]Piercing[/s]: 1',
			].join('\n'),

			// Saved Items
			myItems: this.getSavedItems(),

			statIcons: {
				'max_hp'          : 'max_hp.png',
				'hp_regen'        : 'hp_regeneration.png',
				'lifesteal'       : 'lifesteal.png',
				'damage'          : 'percent_damage.png',

				'melee'           : 'melee_damage.png',
				'ranged'          : 'ranged_damage.png',
				'elemental'       : 'elemental_damage.png',
				'attack_speed'    : 'attack_speed.png',
				'crit'            : 'crit_chance.png',
				'engineering'     : 'engineering.png',
				'range'           : 'range.png',
				'armor'           : 'armor.png',

				'dodge'           : 'dodge.png',
				'speed'           : 'speed.png',
				'luck'            : 'luck.png',
				'harvesting'      : 'harvesting.png',

				// 'crit_chance'     : 'crit_chance.png',
				// 'elemental_damage': 'elemental_damage.png',
				// 'hp_regeneration' : 'hp_regeneration.png',
				// 'melee_damage'    : 'melee_damage.png',
				// 'percent_damage'  : 'percent_damage.png',
				// 'ranged_damage'   : 'ranged_damage.png',
			},

			tiersData: {
				0: { txt: 'C', tooltip: 'Character' },
				1: { txt: '1', tooltip: 'Tier 1 (Common)' },
				2: { txt: '2', tooltip: 'Tier 2 (Uncommon)' },
				3: { txt: '3', tooltip: 'Tier 3 (Rare)' },
				4: { txt: '4', tooltip: 'Tier 4 (Legendary)' },
			},

			helpNotes: [
				{ txt: 'Positive', cls: 'text-positive--pastel', code: '[p]+10[/p]' },
				{ txt: 'Negative', cls: 'text-negative--pastel', code: '[n]-10[/n]' },
				{ txt: 'Stat',     cls: 'text-cream',            code: '[s]Damage:[/s]' },
				{ txt: 'Icon',     cls: 'text-grey',             code: '[i]armor[/i]' },
			],

			// Debug stuff
			renderSVG: '',
			svgUrl: '#',


			debugModeOn: false,
		}
	},
	methods: {
		getBgClasses() {
			return [
				// `rarity${this.tier}`,
				// `rarity${this.tier}dark`,
				'border-color-tier' + this.tier,
				'bg-color-tier' + this.tier,
				'color-tier' + this.tier,
				'bg-dark-color-tier' + this.tier,
			].concat();
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

			str = this.applyTextIcons(str);
			return str;
		},
		applyTextIcons(str = '') {
			// Shows stats as icon images, eg [i]armor[/i]
			for (const [key, value] of Object.entries(this.statIcons)) {
				str = str.replaceAll( `[i]${key}[/i]`, `<span class="staticon"><img src="assets/img/stats/${value}"></span>` );
			}
			return str;
		},
		getTextIcons() {

		},
		getWidthInlineStyle() {
			return `width: ${this.width}px;`;
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
			return 'assets/img/icons/' + this.icons[key];
		},
		setIcon(key) {
			this.icon = key;
		},
		getImageUrl(type, key) { // @todo: unused
			let url = '';
			switch( type )
			{
				case 'icon':
					url = `assets/img/icons/${this.icons[key]}`;
					break;

				case 'stat':
					url = `assets/img/stats/${key}`;
					break;
			}
			return url;
		},

		// Click the icon to cycle through them
		cycleIcons() {
			// Find index of current icon, and increment it (or loop back to 0)
			const iconsArr = Object.entries(this.icons);
			let newIndx = 0;

			console.log(iconsArr);

			const curr_indx = iconsArr.findIndex( ( item ) => ( item[0] === this.icon ) );

			if ( curr_indx === ( iconsArr.length - 1 ) ) {
				newIndx = 0;
			} else {
				newIndx = curr_indx + 1;
			}

			const newIconID = iconsArr[newIndx][0];

			this.icon = newIconID;
		},






		// Saving + Loading
		// ============================================================================

		toggleSaveSidebar() {
			this.showSidebar = !this.showSidebar;
		},
		getItemStats() {
			return {
				tier: this.tier,
				name: this.name,
				type: this.type,
				showImg: this.showImg,
				icon: this.icon,
				width: this.width,
				statsText: this.statsText,
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
			this.statsText = itemData.statsText;
		},
		deleteItem(itemIndex) {
			this.myItems.splice(itemIndex, 1);
			this.saveStorageItems();
		},


		// Stats
		// ============================================================================

		addStatLine(type = '') {
			const lb   = ( !this.statsText.length ) ? '' : '\n';
			let el   = '';
			let sign = '';
			let text1 = '';
			let text2 = '';

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
					text1 = 'NAME:';
					text2 = 'VALUE';
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
		addStatIcon(key) {
			this.statsText += `[i]${key}[/i]`;
		},
		addWeaponStats(type = 'melee') {
			const lb = ( !this.statsText.length ) ? '' : '\n';
			let text = '';

			switch( type )
			{
				case 'melee':
					text = this.defaultWeaponTextMelee;
					break;
				case 'ranged':
					text = this.defaultWeaponTextRanged;
					break;
			}

			this.statsText += lb + text;
		},


		// Canvas (Image Saving)
		// ============================================================================

		renderCanvas()
		{
			/**
			 * ⚡ Debug opts
			 */

			// Set to `false` to show the HMTL that will be used in the canvas render.
			// Very helpful for identifying obvious issues
			const removeChild = true; // default: true

			// Set to `true` to log the canvas render stuff to the console.
			const logMarkup = false; // default: false

			// Set to `true` to log the SVG contents of the canvas
			const logResult = false; // default: false

			const doDebugStuff = false;



			const canvas = document.getElementById('canvas');
			const context = canvas.getContext('2d');
			const result = document.getElementById('result');
			const ibox = result.querySelector('.ibox');

			// Update canvas dimensions, based on .ibox
			canvas.setAttribute( 'width', ibox.offsetWidth );
			canvas.setAttribute( 'height', ibox.offsetHeight );

			// const resultDupe = result.cloneNode(true); // use this if you want to load more stuff, eg. for testing (reduces performance)
			const resultDupe = ibox.cloneNode(true);
			const resultTemp = document.getElementById('result-temp');

			// Cleanup: Remove anything in the temp element (this would only
			// happen if the `removeChild` debug option is enabled, and therefore
			// the child wasn't removed at the end of the last process)
			resultTemp.innerHTML = '';

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
				// properties: undefined,
				properties: [
					'align-items', 'background', 'background-color', 'border', 'border-radius', 'box-sizing', 'color',
					'color-scheme', 'cursor', 'display', 'flex-direction', 'flex-grow', 'flex-shrink', 'flex-wrap',
					'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'justify-content', 'line-height',
					'list-style', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-height',
					'max-width','min-height', 'min-width', 'opacity', 'padding', 'text-align', 'text-transform',
					'transition', 'vertical-align', 'white-space', 'width', 'word-break',
					// '@font-face', 'font-family', 'src', 'font-weight', 'font-style',
				]
			});

			//@todo: temp
			this.injectFontStyles(resultDupe);

			// Render Canvas
			const resultHtml = resultDupe.outerHTML;

			// We don't need the temp element any more, we only needed its HTML (with all the inline stuff).
			// Comment this out to preview how it should look
			if ( removeChild )
			{
				resultTemp.removeChild(resultDupe);
			}

			// DEBUG: Log the HTML markup that we'll add to the canvas
			if ( logMarkup )
			{
				console.log(resultHtml);
			}

			rasterizeHTML.drawHTML(resultHtml).then( (renderResult) => {
				if ( logResult )
				{
					console.log({renderResult});
				}

				if ( doDebugStuff )
				{
					this.canvasDebugStuff(renderResult);
				}

				// The -8px accounts for browsers adding margins by default to body, ie: `body {margin: 8px}`
				context.drawImage(renderResult.image, -8, -8);
			});
		},


		injectFontStyles(resultDupe) {
			//@todo: TEMP
			// I have no idea why this isn't working. It *should* load straight from the stylesheet,
			// as the font is local, but it's not doing that. And this doesnt' work either 🤷‍♂️😡
			const inlineStyles = `
				<style>
					@font-face {
						font-family: 'anybodymedium';
						src: url('/assets/fonts/anybody/Anybody-Medium.woff2') format('woff2');
						font-weight: normal;
						font-style: normal;
					}
					.ibox {
						content: "peem";
					}
				</style>
			`;
			const tempCssTestyfix = document.createElement('style'); //@todo: TEMP
			tempCssTestyfix.innerHTML = inlineStyles //@todo: TEMP
			resultDupe.appendChild(tempCssTestyfix); //@todo: TEMP
		},


		// Not intended for use in PRD
		canvasDebugStuff(renderResult) {
			const svgStr = renderResult.svg;

			this.renderSVG = svgStr;

			const dummyEl = document.createElement('svg');
			dummyEl.innerHTML = svgStr;

			const xmlStr = new XMLSerializer().serializeToString(dummyEl);
			const encodedData = window.btoa(xmlStr);

			this.svgUrl = 'data:image/svg+xml;base64,' + encodedData;

			// console.log(this.svgUrl);
		},




		// Syntax Highlighting
		// ============================================================================

		syntaxHighlighter() {
			//@todo: This needs fixing. It's functional, but it seems like the DOM is updated before this can take effect,
			// so you have to click outside the textarea box to see it, then when you edit things inside it again, the syntax
			// highlighting is lost
			return;

			const highlight = window.csHighlight;

			highlight({
				patterns: [
					// Positive
					{
						name: 'text-positive--pastel',
						// https://regex101.com/r/7NPRSQ/1
						match: /^(\[p\][A-z0-9 !"£$%^&*()\/*^\-+\\|<>,.\/?;'#:@~{}`¬¦]+\[\/p\])/,
					},
					{
						name: 'text-positive--pastel',
						match: /^(\[p\])/,
					},
					{
						name: 'text-positive--pastel',
						match: /^(\[\/p\])/,
					},

					// Negative
					{
						name: 'text-negative--pastel',
						// https://regex101.com/r/7NPRSQ/1
						match: /^(\[n\][A-z0-9 !"£$%^&*()\/*^\-+\\|<>,.\/?;'#:@~{}`¬¦]+\[\/n\])/,
					},
					{
						name: 'text-negative--pastel',
						match: /^(\[n\])/,
					},
					{
						name: 'text-negative--pastel',
						match: /^(\[\/n\])/,
					},

					// Stat
					{
						name: 'text-cream',
						// https://regex101.com/r/7NPRSQ/1
						match: /^(\[s\][A-z0-9 !"£$%^&*()\/*^\-+\\|<>,.\/?;'#:@~{}`¬¦]+\[\/s\])/,
					},
					{
						name: 'text-cream',
						match: /^(\[s\])/,
					},
					{
						name: 'text-cream',
						match: /^(\[\/s\])/,
					},

					// Icon
					{
						name: 'text-grey',
						// https://regex101.com/r/7NPRSQ/1
						match: /^(\[i\][A-z0-9 !"£$%^&*()\/*^\-+\\|<>,.\/?;'#:@~{}`¬¦]+\[\/i\])/,
					},
					{
						name: 'text-grey',
						match: /^(\[i\])/,
					},
					{
						name: 'text-grey',
						match: /^(\[\/i\])/,
					},
				]
			});
		},

	}
}).mount('#app')
