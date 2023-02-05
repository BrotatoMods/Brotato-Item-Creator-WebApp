const { createApp } = Vue

createApp({
	data() {
		return {
			// User options:
			tier: 1,
			name: 'My Item',
			type: 'Item',
			showImg: true,
			width: 300,
			statsText: [
				'<p>+8</p> Max HP',
				'<n>-4%</n> Dodge'
			].join('\n'),


			// Render data:
			tiers: [
				{ num: 0, text: "Tier 0 (Character)" },
				{ num: 1, text: "Tier 1" },
				{ num: 2, text: "Tier 2" },
				{ num: 3, text: "Tier 3" },
				{ num: 4, text: "Tier 4" },
			],
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
			str = str.replaceAll( '<p>', '<span class="text-positive">' );
			str = str.replaceAll( '<n>', '<span class="text-negative">' );
			str = str.replaceAll( '<s>', '<span class="text-cream">' );
			str = str.replaceAll( '</p>', '</span>' );
			str = str.replaceAll( '</n>', '</span>' );
			str = str.replaceAll( '</s>', '</span>' );
			str = str.replaceAll( '\n', '<br>' );
			return str;
		},
		getWidthInlineStyle() {
			return `width: ${this.width}px;`
		},
		setType(type) {
			this.type = type;

			if ( type === 'Limited' )
			{
				this.type = "Limited (5)";
			}
		},
		setWidth(width) {
			this.width = width;
		},
		addStatLine(type = '') {
			var lb   = ( !this.statsText.length ) ? '' : '\n';
			var el   = '';
			var sign = '';
			var text1 = '';
			var text2 = '';

			switch( type )
			{
				case 'positive':
					el   = 'p';
					sign = '+';
					text1 = 'VALUE';
					text2 = 'STAT';
					break;

				case 'negative':
					el   = 'n';
					sign = '-';
					text1 = 'VALUE';
					text2 = 'STAT';
					break;

				case 'stat':
					el   = 's';
					sign = '';
					text1 = 'Damage:';
					text2 = '30';
					break;
			}

			this.statsText += `${lb}` + `<${el}>${sign}${text1}</${el}> ${text2}`;
		},
		getStatsText() {
			return this.applyTextColors(this.statsText);
		},
		clearStats() {
			this.statsText = '';
		},

		renderCanvas() {
			const canvas = document.getElementById('canvas');
			const context = canvas.getContext('2d');
			const result = document.getElementById('result');
			const ibox = result.querySelector('.ibox');

			// Update canvas dimensions, based on .ibox
			canvas.setAttribute( 'width', ibox.offsetWidth );
			canvas.setAttribute( 'height', ibox.offsetHeight );

			const resultDupe = result.cloneNode(true);

			// console.log({result});
			// console.log(result.innerHTML);
			// console.log({resultDupe});
			// console.log(resultDupe.innerHTML);

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
			// const resultHtml = result.innerHTML;
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
