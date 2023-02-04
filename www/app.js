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
			console.log(type);

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
	}
}).mount('#app')