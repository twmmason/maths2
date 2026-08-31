// Curriculum data — Year 6 + KS3
// learnVisuals: array of visual specs shown in Learn tab
// examples[].visual: visual spec shown per worked example
// quiz[].visual: visual spec shown per quiz question

const STRANDS = [
  {
    id: 'npv', name: 'Number & Place Value', icon: '\ud83d\udd22', color: '#6366f1',
    desc: 'Understand powers of 10, compose numbers to 10 million, and work with the number line.',
    topics: [
      {
        id: '6npv1', code: '6NPV-1', name: 'Powers of 10',
        learnVisuals: [
          { fn: 'placeValue', opts: { number: '4500', highlight: 4 } },
          { fn: 'sequence', opts: { terms: ['0.01','0.1','1','10','100','1K','10K'], arrows: true } }
        ],
        learn: '<h3>Powers of 10</h3><p>Every place in our number system is <strong>10 times</strong> the value of the place to its right, and <strong>one tenth</strong> the value of the place to its left.</p><div class="key-point"><strong>Key idea:</strong> Moving a digit one column left makes it 10\u00d7 bigger. Moving right makes it 10\u00d7 smaller.</div><p>The powers of 10: 0.01 \u2192 0.1 \u2192 1 \u2192 10 \u2192 100 \u2192 1,000 \u2192 10,000 \u2192 100,000 \u2192 1,000,000 \u2192 10,000,000</p><div class="key-point"><strong>Multiplying by 10, 100, 1000:</strong> Shifts digits left by 1, 2, or 3 places.<br><strong>Dividing by 10, 100, 1000:</strong> Shifts digits right by 1, 2, or 3 places.</div><p>Example: 45 \u00d7 10 = 450. And 3,200 \u00f7 100 = 32.</p>',
        examples: [
          { problem: '36 \u00d7 100 = ?', solution: '<span class="step">Move digits 2 places left: 36 \u2192 3,600</span>',
            visual: { fn: 'multiply', opts: { a: '36', op: '\u00d7', b: '100' } } },
          { problem: '5,400 \u00f7 1,000 = ?', solution: '<span class="step">Move digits 3 places right: 5,400 \u2192 5.4</span>',
            visual: { fn: 'multiply', opts: { a: '5400', op: '\u00f7', b: '1000' } } },
          { problem: 'Make 0.7 one hundred times bigger', solution: '<span class="step">0.7 \u00d7 100 = 70</span>',
            visual: { fn: 'placeValue', opts: { number: '0.70', highlight: 8 } } }
        ],
        quiz: [
          { q: 'What is 250 \u00d7 10?', type: 'mc', options: ['2,500', '250', '25,000', '25'], answer: 0,
            visual: { fn: 'multiply', opts: { a: '250', op: '\u00d7', b: '10' } } },
          { q: 'What is 8,000 \u00f7 100?', type: 'mc', options: ['800', '8', '80', '0.8'], answer: 2,
            visual: { fn: 'multiply', opts: { a: '8000', op: '\u00f7', b: '100' } } },
          { q: 'What is 0.03 \u00d7 1,000?', type: 'input', answer: '30',
            visual: { fn: 'placeValue', opts: { number: '0.03', highlight: 9 } } },
          { q: 'What is 4,500,000 \u00f7 1,000?', type: 'input', answer: '4500',
            visual: { fn: 'multiply', opts: { a: '4.5M', op: '\u00f7', b: '1000' } } }
        ]
      },
      {
        id: '6npv2', code: '6NPV-2', name: 'Compose & decompose numbers to 10 million',
        learnVisuals: [
          { fn: 'placeValue', opts: { number: '5034000.2' } },
          { fn: 'equation', opts: { text: '5,034,000.2 = 5M + 30K + 4K + 0.2' } }
        ],
        learn: '<h3>Composing & Decomposing Numbers</h3><p>Every number can be broken into its <strong>place-value parts</strong>. This is called <em>decomposing</em>. Putting parts back together is <em>composing</em>.</p><div class="key-point"><strong>Standard partitioning:</strong> 5,034,000.2 = 5,000,000 + 30,000 + 4,000 + 0.2</div><p>Non-standard partitioning: 548.32 = 500 + 48 + 0.32</p><div class="key-point"><strong>Why it matters:</strong> Decomposing helps with mental arithmetic and comparing numbers.</div>',
        examples: [
          { problem: 'Value of 5 in 7,205,041?', solution: '<span class="step">5 is in the thousands column \u2192 5,000</span>',
            visual: { fn: 'placeValue', opts: { number: '7205041', highlight: 5 } } },
          { problem: 'Decompose 3,408,600', solution: '<span class="step">3,000,000 + 400,000 + 8,000 + 600</span>',
            visual: { fn: 'placeValue', opts: { number: '3408600' } } },
          { problem: '381,920 \u2212 900 = ?', solution: '<span class="step">Remove 900 from hundreds: 381,020</span>',
            visual: { fn: 'equation', opts: { text: '381,920 \u2212 900 = ?' } } }
        ],
        quiz: [
          { q: 'What is the value of 6 in 2,603,100?', type: 'mc', options: ['600', '6,000', '60,000', '600,000'], answer: 3,
            visual: { fn: 'placeValue', opts: { number: '2603100', highlight: 2 } } },
          { q: 'Which is larger: 7,142,294 or 7,124,294?', type: 'mc', options: ['7,142,294', '7,124,294', 'They are equal'], answer: 0,
            visual: { fn: 'numberLine', opts: { min: 7100000, max: 7200000, marks: [{ value: 7142294, label: 'A', color: '#6366f1' }, { value: 7124294, label: 'B', color: '#ec4899' }] } } },
          { q: '5,000,000 + 30,000 + 200 + 0.5 = ?', type: 'input', answer: '5030200.5',
            visual: { fn: 'equation', opts: { text: '5,000,000 + 30,000 + 200 + 0.5' } } },
          { q: '4,820,000 \u2212 20,000 = ?', type: 'input', answer: '4800000',
            visual: { fn: 'equation', opts: { text: '4,820,000 \u2212 20,000 = ?' } } }
        ]
      },
      {
        id: '6npv3', code: '6NPV-3', name: 'Numbers on the number line (to 10 million)',
        learnVisuals: [
          { fn: 'numberLine', opts: { min: 5000000, max: 6000000, arrow: 5192012, label: '5,192,012' } }
        ],
        learn: '<h3>Numbers on the Number Line</h3><p>You need to place numbers up to <strong>10 million</strong> on a number line and estimate positions.</p><div class="key-point"><strong>Rounding:</strong> Find the previous and next multiple, then decide which is closer. E.g. 5,192,012 rounded to the nearest million is 5,000,000.</div><p>Count forwards and backwards in steps of powers of 10. Watch boundaries: 2,100,000 \u2192 2,000,000 \u2192 1,900,000.</p>',
        examples: [
          { problem: 'Round 5,192,012 to nearest million', solution: '<span class="step">Previous: 5,000,000. Next: 6,000,000. Closer to 5M.</span>',
            visual: { fn: 'numberLine', opts: { min: 5000000, max: 6000000, arrow: 5192012, label: '5,192,012' } } },
          { problem: 'Round 5,192,012 to nearest 100,000', solution: '<span class="step">Previous: 5,100,000. Next: 5,200,000. Closer to 5,200,000.</span>',
            visual: { fn: 'numberLine', opts: { min: 5100000, max: 5200000, arrow: 5192012, label: '5,192,012' } } }
        ],
        quiz: [
          { q: 'Round 3,782,000 to the nearest million', type: 'mc', options: ['3,000,000', '4,000,000', '3,800,000'], answer: 1,
            visual: { fn: 'numberLine', opts: { min: 3000000, max: 4000000, arrow: 3782000, label: '3,782,000' } } },
          { q: 'What comes next? 2,100,000 \u2192 2,000,000 \u2192 ?', type: 'input', answer: '1900000',
            visual: { fn: 'sequence', opts: { terms: ['2.1M', '2.0M', '?'], arrows: true } } },
          { q: 'Round 6,450,000 to the nearest million', type: 'mc', options: ['6,000,000', '7,000,000', '6,500,000'], answer: 1,
            visual: { fn: 'numberLine', opts: { min: 6000000, max: 7000000, arrow: 6450000, label: '6,450,000' } } },
          { q: 'Round 8,349,999 to nearest 100,000', type: 'input', answer: '8300000',
            visual: { fn: 'numberLine', opts: { min: 8000000, max: 8500000, arrow: 8349999, label: '8,349,999', marks: [{ value: 8300000, label: '8.3M', above: true }, { value: 8400000, label: '8.4M', above: true }] } } }
        ]
      },
      {
        id: '6npv4', code: '6NPV-4', name: 'Divide powers of 10 & read scales',
        learnVisuals: [
          { fn: 'scale', opts: { min: 0, max: 1000, divisions: 4 } }
        ],
        learn: '<h3>Dividing Powers of 10 & Reading Scales</h3><p>Divide powers of 10 into <strong>2, 4, 5 and 10</strong> equal parts.</p><div class="key-point"><strong>Example:</strong> 1,000 \u00f7 4 = 250. Scale 0\u20131,000 in 4 parts: 0, 250, 500, 750, 1,000.</div><p>Essential for reading rulers, thermometers, measuring jugs, and graphs.</p>',
        examples: [
          { problem: 'Divide 1,000,000 into 5 equal parts', solution: '<span class="step">1,000,000 \u00f7 5 = 200,000. Marks: 0, 200k, 400k, 600k, 800k, 1M</span>',
            visual: { fn: 'scale', opts: { min: 0, max: 1000000, divisions: 5 } } },
          { problem: 'Scale 0\u2013100, 4 divisions. Each interval?', solution: '<span class="step">100 \u00f7 4 = 25</span>',
            visual: { fn: 'scale', opts: { min: 0, max: 100, divisions: 4 } } }
        ],
        quiz: [
          { q: '10,000 \u00f7 5 = ?', type: 'input', answer: '2000',
            visual: { fn: 'scale', opts: { min: 0, max: 10000, divisions: 5 } } },
          { q: 'Scale 0\u20131,000 in 4 parts. Second mark value?', type: 'mc', options: ['200', '250', '500', '400'], answer: 2,
            visual: { fn: 'scale', opts: { min: 0, max: 1000, divisions: 4, highlight: 2 } } },
          { q: '0.1 \u00f7 10 = ?', type: 'input', answer: '0.01',
            visual: { fn: 'multiply', opts: { a: '0.1', op: '\u00f7', b: '10' } } },
          { q: '1,000,000 \u00f7 4 = ?', type: 'input', answer: '250000',
            visual: { fn: 'scale', opts: { min: 0, max: 1000000, divisions: 4 } } }
        ]
      }
    ]
  },
  {
    id: 'asmd', name: 'Arithmetic & Structure', icon: '\u2796', color: '#8b5cf6',
    desc: 'Additive and multiplicative relationships, deriving calculations, ratio, and unknowns.',
    topics: [
      {
        id: '6asmd1', code: '6AS/MD-1', name: 'Additive vs multiplicative relationships',
        learnVisuals: [
          { fn: 'equation', opts: { text: '75 = 3 + 72 (additive)' } },
          { fn: 'equation', opts: { text: '75 = 3 \u00d7 25 (multiplicative)' } }
        ],
        learn: '<h3>Additive vs Multiplicative</h3><p>Two numbers can be related <strong>additively</strong> (by adding/subtracting) or <strong>multiplicatively</strong> (by multiplying/dividing).</p><div class="key-point"><strong>Additive:</strong> 75 = 3 + 72.<br><strong>Multiplicative:</strong> 75 = 3 \u00d7 25.</div><div class="key-point"><strong>Sequences:</strong> Same amount each time = additive. Same factor = multiplicative.</div>',
        examples: [
          { problem: '4 and 16: additive and multiplicative?', solution: '<span class="step">Additive: 4 + 12 = 16. Multiplicative: 4 \u00d7 4 = 16.</span>',
            visual: { fn: 'barModel', opts: { groups: [4, 12], colors: ['rgba(99,102,241,0.4)', 'rgba(245,158,11,0.3)'], labels: ['4', '+12'] } } },
          { problem: 'Sequence: 0.5, 5, ?, ?', solution: '<span class="step">\u00d710 each time: 0.5, 5, 50, 500</span>',
            visual: { fn: 'sequence', opts: { terms: ['0.5', '5', '?', '?'], arrows: true } } }
        ],
        quiz: [
          { q: '300 \u00d7 ? = 1,200', type: 'input', answer: '4',
            visual: { fn: 'equation', opts: { text: '300 \u00d7 ? = 1,200' } } },
          { q: '300 + ? = 1,200', type: 'input', answer: '900',
            visual: { fn: 'equation', opts: { text: '300 + ? = 1,200' } } },
          { q: 'Is 2, 6, 18, 54 additive or multiplicative?', type: 'mc', options: ['Additive', 'Multiplicative'], answer: 1,
            visual: { fn: 'sequence', opts: { terms: ['2', '6', '18', '54'], arrows: true } } },
          { q: 'Continue: 25, 125, 625, ?', type: 'input', answer: '3125',
            visual: { fn: 'sequence', opts: { terms: ['25', '125', '625', '?'], arrows: true } } }
        ]
      },
      {
        id: '6asmd2', code: '6AS/MD-2', name: 'Derive related calculations',
        learnVisuals: [
          { fn: 'equation', opts: { text: '25 + 35 = 27.5 + 32.5 = 60' } },
          { fn: 'equation', opts: { text: '0.3 \u00d7 320 = 3 \u00d7 32 = 96' } }
        ],
        learn: '<h3>Deriving Related Calculations</h3><p>Use known facts and arithmetic properties to work out new calculations.</p><div class="key-point"><strong>Compensation (addition):</strong> If one addend increases, decrease the other. Sum stays the same.<br>25 + 35 = 27.5 + 32.5</div><div class="key-point"><strong>Compensation (multiplication):</strong> Multiply one factor by n, divide the other by n. Product stays the same.<br>0.3 \u00d7 320 = 3 \u00d7 32 = 96</div>',
        examples: [
          { problem: 'Given 72 \u00d7 34 = 2,448. Find 72 \u00d7 340', solution: '<span class="step">72 \u00d7 340 = 2,448 \u00d7 10 = 24,480</span>',
            visual: { fn: 'equation', opts: { text: '72\u00d734 = 2448 \u2192 72\u00d7340 = ?' } } },
          { problem: '327 + 278 = 605. So 327 + 515 = ?', solution: '<span class="step">515 = 278 + 237. 605 + 237 = 842</span>',
            visual: { fn: 'equation', opts: { text: '327+278 = 605 \u2192 327+515 = ?' } } }
        ],
        quiz: [
          { q: '25 \u00d7 48 = 1,200. What is 50 \u00d7 24?', type: 'input', answer: '1200',
            visual: { fn: 'equation', opts: { text: '25\u00d748 = 1200 \u2192 50\u00d724 = ?' } } },
          { q: '256 \u00d7 85 = 21,760. What is 256 \u00d7 8.5?', type: 'input', answer: '2176',
            visual: { fn: 'equation', opts: { text: '256\u00d785 = 21760 \u2192 256\u00d78.5 = ?' } } },
          { q: 'If 327 + 278 = 605, what is 330 + 275?', type: 'mc', options: ['605', '600', '610', '595'], answer: 0,
            visual: { fn: 'equation', opts: { text: '327+278 = 605 \u2192 330+275 = ?' } } },
          { q: '3 \u00d7 4 = 12. What is 30 \u00d7 40?', type: 'input', answer: '1200',
            visual: { fn: 'equation', opts: { text: '3\u00d74 = 12 \u2192 30\u00d740 = ?' } } }
        ]
      },
      {
        id: '6asmd3', code: '6AS/MD-3', name: 'Ratio relationships',
        learnVisuals: [
          { fn: 'barModel', opts: { groups: [1, 2], colors: ['rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)'], labels: ['rice', 'water \u00d72'] } }
        ],
        learn: '<h3>Ratio Relationships</h3><p>A ratio describes a <strong>correspondence</strong> between quantities.</p><div class="key-point"><strong>Proportionality:</strong> The ratio stays the same when you scale up. 1:2 = 5:10 = 10:20.</div><div class="key-point"><strong>Many-to-many:</strong> "For every 2 yellow beads there are 3 green beads" \u2192 group of 5.</div>',
        examples: [
          { problem: 'For every 1 red bead, 3 blue. 5 red = ? blue', solution: '<span class="step">1:3 ratio. 5 \u00d7 3 = 15 blue</span>',
            visual: { fn: 'barModel', opts: { groups: [1, 3], colors: ['rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)'], labels: ['1 red', '3 blue'] } } },
          { problem: '21 blue beads (1:3 ratio). Total?', solution: '<span class="step">21\u00f73 = 7 red. Total = 28</span>',
            visual: { fn: 'barModel', opts: { groups: [7, 21], colors: ['rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)'], labels: ['7 red', '21 blue'] } } }
        ],
        quiz: [
          { q: 'Ratio 1:4. If there are 20 blue, how many red?', type: 'input', answer: '5',
            visual: { fn: 'barModel', opts: { groups: [1, 4], colors: ['rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)'], labels: ['red', 'blue \u00d74'] } } },
          { q: 'Ratio 2:3. 10 yellow beads = ? green', type: 'input', answer: '15',
            visual: { fn: 'barModel', opts: { groups: [2, 3], colors: ['rgba(245,158,11,0.4)', 'rgba(34,197,94,0.4)'], labels: ['2', '3'] } } },
          { q: 'Ratio 1:2. 18 total. How many of the larger group?', type: 'mc', options: ['6', '9', '12', '18'], answer: 2,
            visual: { fn: 'barModel', opts: { groups: [1, 2], colors: ['rgba(239,68,68,0.4)', 'rgba(59,130,246,0.4)'], labels: ['1', '2'] } } },
          { q: 'Smoothie: 20 strawberries for 2 people. For 5 people?', type: 'input', answer: '50',
            visual: { fn: 'equation', opts: { text: '2 people \u2192 20 \u00b7 5 people \u2192 ?' } } }
        ]
      },
      {
        id: '6asmd4', code: '6AS/MD-4', name: 'Problems with 2 unknowns',
        learnVisuals: [
          { fn: 'equation', opts: { text: '1 eraser + 5 pencils = \u00a33.35' } },
          { fn: 'equation', opts: { text: '5 erasers + 5 pencils = \u00a34.75' } }
        ],
        learn: '<h3>Problems with 2 Unknowns</h3><p>Some problems have <strong>two values to find</strong>.</p><div class="key-point"><strong>Strategy:</strong> Use relationships between unknowns. Find one, then the other.</div><p>Example: 1 eraser + 5 pencils = \u00a33.35. 5 erasers + 5 pencils = \u00a34.75. Difference = 4 erasers = \u00a31.40, so 1 eraser = \u00a30.35.</p>',
        examples: [
          { problem: 'Adult = child + \u00a32. 3 adults + 2 children = \u00a333.', solution: '<span class="step">Let c = child. 3(c+2) + 2c = 33 \u2192 5c = 27 \u2192 c = 5.40. Adult = 7.40</span>',
            visual: { fn: 'equation', opts: { text: 'A = C + 2, 3A + 2C = 33' } } },
          { problem: 'Rectangle perimeter = 30. a is 2-digit, b is 1-digit.', solution: '<span class="step">a + b = 15. Possible: 10+5, 11+4, 12+3, 13+2, 14+1</span>',
            visual: { fn: 'shape', opts: { type: 'rectangle', w: 10, h: 5 } } }
        ],
        quiz: [
          { q: 'a + b = 10, a = 3b. What is a?', type: 'input', answer: '7.5',
            visual: { fn: 'equation', opts: { text: 'a + b = 10, a = 3b' } } },
          { q: 'x + y = 20, x \u2212 y = 4. What is x?', type: 'input', answer: '12',
            visual: { fn: 'equation', opts: { text: 'x + y = 20, x \u2212 y = 4' } } },
          { q: '2 small + 1 large box = 26 cakes. 1 small = 5. Large = ?', type: 'input', answer: '16',
            visual: { fn: 'barModel', opts: { groups: [5, 5, 16], colors: ['rgba(99,102,241,0.3)', 'rgba(99,102,241,0.3)', 'rgba(245,158,11,0.3)'], labels: ['S', 'S', 'L=?'] } } },
          { q: 'Perimeter = 20cm. Length is 3\u00d7 width. Width = ?', type: 'mc', options: ['2.5 cm', '5 cm', '3 cm', '4 cm'], answer: 0,
            visual: { fn: 'shape', opts: { type: 'rectangle', w: 15, h: 5 } } }
        ]
      }
    ]
  },
  {
    id: 'frac', name: 'Fractions', icon: '\u00bd', color: '#ec4899',
    desc: 'Simplify fractions, find common denominators, and compare fractions using reasoning.',
    topics: [
      {
        id: '6f1', code: '6F-1', name: 'Simplify fractions',
        learnVisuals: [
          { fn: 'fractionBar', opts: { numerator: 6, denominator: 15 } },
          { fn: 'fractionBar', opts: { numerator: 2, denominator: 5 } }
        ],
        learn: '<h3>Simplifying Fractions</h3><p>A fraction is in its <strong>simplest form</strong> when the numerator and denominator share no common factor other than 1.</p><div class="key-point"><strong>To simplify:</strong> Divide both by their HCF. E.g. 6/15 \u2192 HCF=3 \u2192 2/5.</div><div class="key-point"><strong>Always check:</strong> Confirm no common factors remain.</div>',
        examples: [
          { problem: 'Simplify 4/12', solution: '<span class="step">HCF=4. 4\u00f74=1, 12\u00f74=3 \u2192 1/3</span>',
            visual: { fn: 'fractionBar', opts: { numerator: 4, denominator: 12 } } },
          { problem: 'Simplify 15/20', solution: '<span class="step">HCF=5. 15\u00f75=3, 20\u00f75=4 \u2192 3/4</span>',
            visual: { fn: 'fractionBar', opts: { numerator: 15, denominator: 20 } } }
        ],
        quiz: [
          { q: 'Simplify 6/18', type: 'input', answer: '1/3',
            visual: { fn: 'fractionBar', opts: { numerator: 6, denominator: 18 } } },
          { q: 'Simplify 8/12', type: 'mc', options: ['4/6', '2/3', '3/4', '1/2'], answer: 1,
            visual: { fn: 'fractionBar', opts: { numerator: 8, denominator: 12 } } },
          { q: 'Is 7/21 in simplest form?', type: 'mc', options: ['Yes', 'No \u2014 it simplifies to 1/3'], answer: 1,
            visual: { fn: 'fractionBar', opts: { numerator: 7, denominator: 21 } } },
          { q: 'Simplify 25/100', type: 'input', answer: '1/4',
            visual: { fn: 'fractionBar', opts: { numerator: 25, denominator: 100 } } }
        ]
      },
      {
        id: '6f2', code: '6F-2', name: 'Common denomination & compare',
        learnVisuals: [
          { fn: 'fractionBar', opts: { numerator: 1, denominator: 5, compare: { n2: 4, d2: 15 } } }
        ],
        learn: '<h3>Common Denominators</h3><p>To compare fractions with different denominators, express them with a <strong>common denominator</strong>.</p><div class="key-point"><strong>If one divides the other:</strong> Use the larger. E.g. 1/5 and 4/15 \u2192 use 15.</div><div class="key-point"><strong>Otherwise:</strong> Multiply denominators. E.g. 1/3 and 3/8 \u2192 use 24.</div>',
        examples: [
          { problem: 'Compare 1/5 and 4/15', solution: '<span class="step">1/5 = 3/15. 3/15 < 4/15.</span>',
            visual: { fn: 'fractionBar', opts: { numerator: 1, denominator: 5, compare: { n2: 4, d2: 15 } } } },
          { problem: 'Compare 1/3 and 3/8', solution: '<span class="step">1/3 = 8/24. 3/8 = 9/24. 8/24 < 9/24.</span>',
            visual: { fn: 'fractionBar', opts: { numerator: 1, denominator: 3, compare: { n2: 3, d2: 8 } } } }
        ],
        quiz: [
          { q: 'Express 2/3 with denominator 12', type: 'input', answer: '8/12',
            visual: { fn: 'fractionBar', opts: { numerator: 2, denominator: 3 } } },
          { q: 'Which is larger: 3/7 or 5/8?', type: 'mc', options: ['3/7', '5/8'], answer: 1,
            visual: { fn: 'fractionBar', opts: { numerator: 3, denominator: 7, compare: { n2: 5, d2: 8 } } } },
          { q: 'Common denominator for 1/4 and 1/6?', type: 'mc', options: ['10', '12', '24', '8'], answer: 1,
            visual: { fn: 'fractionBar', opts: { numerator: 1, denominator: 4, compare: { n2: 1, d2: 6 } } } },
          { q: '5/6 or 7/9 \u2014 which is larger?', type: 'mc', options: ['5/6', '7/9', 'They are equal'], answer: 0,
            visual: { fn: 'fractionBar', opts: { numerator: 5, denominator: 6, compare: { n2: 7, d2: 9 } } } }
        ]
      },
      {
        id: '6f3', code: '6F-3', name: 'Compare fractions by reasoning',
        learnVisuals: [
          { fn: 'fractionBar', opts: { numerator: 2, denominator: 5, compare: { n2: 2, d2: 6 } } }
        ],
        learn: '<h3>Comparing Fractions by Reasoning</h3><p>You don\'t always need common denominators. Use <strong>reasoning</strong>.</p><div class="key-point"><strong>Same numerator:</strong> Larger denominator = smaller fraction. 2/5 > 2/6.</div><div class="key-point"><strong>Close to 1:</strong> 7/8 is 1/8 from 1. 6/7 is 1/7 from 1. Since 1/8 < 1/7, 7/8 > 6/7.</div>',
        examples: [
          { problem: 'Compare 3/5 and 3/8', solution: '<span class="step">Same numerator. Larger denom = smaller. 3/5 > 3/8.</span>',
            visual: { fn: 'fractionBar', opts: { numerator: 3, denominator: 5, compare: { n2: 3, d2: 8 } } } },
          { problem: 'Compare 5/6 and 7/11', solution: '<span class="step">5/6 is large part of whole. 7/11 is smaller part. 5/6 > 7/11.</span>',
            visual: { fn: 'fractionBar', opts: { numerator: 5, denominator: 6, compare: { n2: 7, d2: 11 } } } }
        ],
        quiz: [
          { q: 'Which is larger: 1/5 or 1/8?', type: 'mc', options: ['1/5', '1/8'], answer: 0,
            visual: { fn: 'fractionBar', opts: { numerator: 1, denominator: 5, compare: { n2: 1, d2: 8 } } } },
          { q: 'Which is larger: 7/8 or 6/7?', type: 'mc', options: ['7/8', '6/7', 'They are equal'], answer: 0,
            visual: { fn: 'fractionBar', opts: { numerator: 7, denominator: 8, compare: { n2: 6, d2: 7 } } } },
          { q: 'Order smallest to largest: 3/3, 3/8, 3/5', type: 'mc', options: ['3/8, 3/5, 3/3', '3/3, 3/5, 3/8', '3/5, 3/8, 3/3'], answer: 0,
            visual: { fn: 'fractionBar', opts: { numerator: 3, denominator: 8 } } },
          { q: 'Is 4/9 more or less than 1/2?', type: 'mc', options: ['More than 1/2', 'Less than 1/2', 'Exactly 1/2'], answer: 1,
            visual: { fn: 'fractionBar', opts: { numerator: 4, denominator: 9 } } }
        ]
      }
    ]
  },
  {
    id: 'geom', name: 'Geometry', icon: '\u25b3', color: '#14b8a6',
    desc: 'Draw, compose and decompose shapes using dimensions, angles and area.',
    topics: [
      {
        id: '6g1', code: '6G-1', name: 'Draw, compose & decompose shapes',
        learnVisuals: [
          { fn: 'shape', opts: { type: 'rectangle', w: 5, h: 2 } },
          { fn: 'shape', opts: { type: 'triangle', w: 6, h: 4 } }
        ],
        learn: '<h3>Shapes: Draw, Compose & Decompose</h3><p>Draw shapes to meet given measurements and break complex shapes into simpler ones.</p><div class="key-point"><strong>Composing:</strong> Joining simple shapes to form compound shapes.</div><div class="key-point"><strong>Decomposing:</strong> Breaking compound shapes into rectangles/triangles to find area.</div>',
        examples: [
          { problem: 'Rectangle perimeter = 14cm. Give dimensions.', solution: '<span class="step">Half perimeter = 7. Possible: 1\u00d76, 2\u00d75, 3\u00d74</span>',
            visual: { fn: 'shape', opts: { type: 'rectangle', w: 5, h: 2 } } },
          { problem: '3 identical rects form a large rect 15cm wide.', solution: '<span class="step">15\u00f73 = 5cm each. If square: perimeter = 2(15+5) = 40cm</span>',
            visual: { fn: 'shape', opts: { type: 'rectangle', w: 15, h: 5 } } }
        ],
        quiz: [
          { q: 'Rectangle perimeter = 20cm. Width = 3cm. Length = ?', type: 'input', answer: '7',
            visual: { fn: 'shape', opts: { type: 'rectangle', w: 7, h: 3 } } },
          { q: 'Square area = 64cm\u00b2. Side length = ?', type: 'input', answer: '8',
            visual: { fn: 'shape', opts: { type: 'square', w: 8 } } },
          { q: 'Triangle: base=6cm, height=4cm. Area = ?', type: 'mc', options: ['24 cm\u00b2', '12 cm\u00b2', '10 cm\u00b2', '20 cm\u00b2'], answer: 1,
            visual: { fn: 'shape', opts: { type: 'triangle', w: 6, h: 4 } } },
          { q: 'Rectangle 8cm \u00d7 5cm. Perimeter = ?', type: 'input', answer: '26',
            visual: { fn: 'shape', opts: { type: 'rectangle', w: 8, h: 5 } } }
        ]
      }
    ]
  },
  {
    id: 'ks3num', name: 'KS3: Number', icon: '#\ufe0f\u20e3', color: '#f59e0b',
    desc: 'Extend number skills: primes, factors, standard form, and four operations with negatives.',
    topics: [
      {
        id: 'ks3n1', code: 'KS3-N1', name: 'Primes, factors & multiples',
        learnVisuals: [
          { fn: 'equation', opts: { text: '60 = 2\u00b2 \u00d7 3 \u00d7 5' } },
          { fn: 'sequence', opts: { terms: ['2','3','5','7','11','13'], arrows: false } }
        ],
        learn: '<h3>Primes, Factors & Multiples</h3><p>A <strong>prime</strong> has exactly 2 factors: 1 and itself.</p><div class="key-point"><strong>HCF:</strong> Largest number dividing both. HCF(12,18)=6.<br><strong>LCM:</strong> Smallest number both divide into. LCM(4,6)=12.</div><p><strong>Prime factorisation:</strong> 60 = 2\u00b2 \u00d7 3 \u00d7 5.</p>',
        examples: [
          { problem: 'Prime factorisation of 36', solution: '<span class="step">36 = 2\u00b2 \u00d7 3\u00b2</span>',
            visual: { fn: 'equation', opts: { text: '36 = 2\u00d72\u00d73\u00d73 = 2\u00b2\u00d73\u00b2' } } },
          { problem: 'HCF(24, 36)', solution: '<span class="step">24 = 2\u00b3\u00d73, 36 = 2\u00b2\u00d73\u00b2. HCF = 2\u00b2\u00d73 = 12</span>',
            visual: { fn: 'barModel', opts: { groups: [24, 36], colors: ['rgba(99,102,241,0.3)', 'rgba(236,72,153,0.3)'], labels: ['24', '36'] } } },
          { problem: 'LCM(4, 6)', solution: '<span class="step">Multiples: 4,8,12... and 6,12... LCM = 12</span>',
            visual: { fn: 'sequence', opts: { terms: ['4','8','12','16'], arrows: true } } }
        ],
        quiz: [
          { q: 'Is 27 prime?', type: 'mc', options: ['Yes', 'No'], answer: 1,
            visual: { fn: 'equation', opts: { text: '27 = 3 \u00d7 9 = 3 \u00d7 3 \u00d7 3' } } },
          { q: 'HCF(16, 24) = ?', type: 'input', answer: '8',
            visual: { fn: 'barModel', opts: { groups: [16, 24], colors: ['rgba(99,102,241,0.3)', 'rgba(236,72,153,0.3)'], labels: ['16', '24'] } } },
          { q: 'LCM(3, 5) = ?', type: 'input', answer: '15',
            visual: { fn: 'sequence', opts: { terms: ['3','6','9','12','15'], arrows: true } } },
          { q: 'Prime factorisation of 30?', type: 'mc', options: ['2 \u00d7 3 \u00d7 5', '5 \u00d7 6', '2 \u00d7 15', '3 \u00d7 10'], answer: 0,
            visual: { fn: 'equation', opts: { text: '30 = ? \u00d7 ? \u00d7 ?' } } }
        ]
      },
      {
        id: 'ks3n2', code: 'KS3-N2', name: 'Operations with negatives & decimals',
        learnVisuals: [
          { fn: 'numberLine', opts: { min: -20, max: 20, marks: [{ value: 0, label: '0' }, { value: -15, label: '-15', color: '#ef4444' }, { value: 12, label: '12', color: '#22c55e' }] } }
        ],
        learn: '<h3>Operations with Negatives & Decimals</h3><p>Four operations applied to integers, decimals, and fractions \u2014 positive and negative.</p><div class="key-point"><strong>Negative rules:</strong> +\u00d7\u2212 = \u2212, \u2212\u00d7\u2212 = +. Same for division.</div><div class="key-point"><strong>BIDMAS:</strong> Brackets, Indices, Division/Multiplication, Addition/Subtraction.</div>',
        examples: [
          { problem: '-3 \u00d7 -4 = ?', solution: '<span class="step">Neg \u00d7 Neg = Pos. Answer: 12</span>',
            visual: { fn: 'equation', opts: { text: '(-3) \u00d7 (-4) = +12' } } },
          { problem: '2 + 3 \u00d7 4 = ?', solution: '<span class="step">Mult first: 12. Then 2+12 = 14.</span>',
            visual: { fn: 'equation', opts: { text: '2 + 3\u00d74 = 2 + 12 = 14' } } }
        ],
        quiz: [
          { q: '-5 \u00d7 3 = ?', type: 'input', answer: '-15',
            visual: { fn: 'numberLine', opts: { min: -20, max: 5, arrow: -15, label: '-5\u00d73', marks: [{ value: 0, label: '0' }] } } },
          { q: '-8 \u00f7 -2 = ?', type: 'input', answer: '4',
            visual: { fn: 'equation', opts: { text: '-8 \u00f7 -2 = ?' } } },
          { q: '10 - 3 \u00d7 4 = ?', type: 'mc', options: ['28', '-2', '22', '-12'], answer: 1,
            visual: { fn: 'equation', opts: { text: '10 - 3 \u00d7 4 = ? (BIDMAS!)' } } },
          { q: '(-2)\u00b3 = ?', type: 'input', answer: '-8',
            visual: { fn: 'equation', opts: { text: '(-2)\u00b3 = (-2)\u00d7(-2)\u00d7(-2)' } } }
        ]
      }
    ]
  },
  {
    id: 'ks3alg', name: 'KS3: Algebra', icon: '\ud835\udc65', color: '#06b6d4',
    desc: 'Expressions, equations, sequences, and graphs.',
    topics: [
      {
        id: 'ks3a1', code: 'KS3-A1', name: 'Expressions & equations',
        learnVisuals: [
          { fn: 'equation', opts: { text: '2a + 3b + 5a = 7a + 3b' } },
          { fn: 'equation', opts: { text: '3x + 2 = 14 \u2192 x = 4' } }
        ],
        learn: '<h3>Expressions & Equations</h3><p>An <strong>expression</strong> uses letters and numbers (3x + 2). An <strong>equation</strong> says two are equal (3x + 2 = 14).</p><div class="key-point"><strong>Simplify:</strong> Collect like terms. 2a + 3b + 5a = 7a + 3b</div><div class="key-point"><strong>Solve:</strong> Use inverse operations. 3x + 2 = 14 \u2192 x = 4</div>',
        examples: [
          { problem: 'Simplify: 4x + 3 + 2x - 1', solution: '<span class="step">(4x+2x) + (3-1) = 6x + 2</span>',
            visual: { fn: 'equation', opts: { text: '4x + 3 + 2x - 1 = ?' } } },
          { problem: 'Solve: 5x - 3 = 22', solution: '<span class="step">5x = 25 \u2192 x = 5</span>',
            visual: { fn: 'equation', opts: { text: '5x - 3 = 22' } } }
        ],
        quiz: [
          { q: 'Simplify: 3a + 2a + 4', type: 'mc', options: ['5a + 4', '9a', '3a + 6', '5a4'], answer: 0,
            visual: { fn: 'equation', opts: { text: '3a + 2a + 4 = ?' } } },
          { q: 'Solve: 2x + 6 = 20. x = ?', type: 'input', answer: '7',
            visual: { fn: 'equation', opts: { text: '2x + 6 = 20' } } },
          { q: 'Expand: 3(x + 4) = ?', type: 'mc', options: ['3x + 4', '3x + 12', 'x + 12', '3x + 7'], answer: 1,
            visual: { fn: 'equation', opts: { text: '3(x + 4) = ?' } } },
          { q: 'Solve: 4x - 8 = 0. x = ?', type: 'input', answer: '2',
            visual: { fn: 'equation', opts: { text: '4x - 8 = 0' } } }
        ]
      },
      {
        id: 'ks3a2', code: 'KS3-A2', name: 'Sequences',
        learnVisuals: [
          { fn: 'sequence', opts: { terms: ['3','7','11','15','19'], arrows: true } },
          { fn: 'equation', opts: { text: 'nth term = 4n - 1' } }
        ],
        learn: '<h3>Sequences</h3><p>A <strong>sequence</strong> is an ordered list following a rule.</p><div class="key-point"><strong>Arithmetic:</strong> Add same each time. 3,7,11,15 (diff=4). nth term = 4n-1.</div><div class="key-point"><strong>Geometric:</strong> Multiply same each time. 2,6,18,54 (\u00d73).</div>',
        examples: [
          { problem: 'nth term: 5, 8, 11, 14...', solution: '<span class="step">Diff = 3. nth term = 3n + 2. Check: n=1\u21925 \u2713</span>',
            visual: { fn: 'sequence', opts: { terms: ['5','8','11','14','...'], arrows: true } } },
          { problem: 'Next 2 terms: 2, 6, 18, 54...', solution: '<span class="step">\u00d73 each time: 162, 486</span>',
            visual: { fn: 'sequence', opts: { terms: ['2','6','18','54','?','?'], arrows: true } } }
        ],
        quiz: [
          { q: 'Next term: 4, 9, 14, 19, ?', type: 'input', answer: '24',
            visual: { fn: 'sequence', opts: { terms: ['4', '9', '14', '19', '?'], arrows: true } } },
          { q: 'nth term of 2, 5, 8, 11?', type: 'mc', options: ['3n - 1', '3n + 2', 'n + 3', '2n + 1'], answer: 0,
            visual: { fn: 'sequence', opts: { terms: ['2', '5', '8', '11', '...'], arrows: true } } },
          { q: 'Geometric: 3, 12, 48, ?', type: 'input', answer: '192',
            visual: { fn: 'sequence', opts: { terms: ['3', '12', '48', '?'], arrows: true } } },
          { q: '10th term of 3n + 1?', type: 'input', answer: '31',
            visual: { fn: 'equation', opts: { text: 'T(n) = 3n + 1 \u2192 T(10) = ?' } } }
        ]
      }
    ]
  },
  {
    id: 'ks3ratio', name: 'KS3: Ratio & Proportion', icon: '\u2696\ufe0f', color: '#f97316',
    desc: 'Percentages, proportion, unit conversions and compound units.',
    topics: [
      {
        id: 'ks3r1', code: 'KS3-R1', name: 'Percentages',
        learnVisuals: [
          { fn: 'percentBar', opts: { total: 80, percent: 15, label: '15% of 80 = 12' } },
          { fn: 'percentBar', opts: { total: 60, percent: 120, label: '+20%: 60 \u2192 72' } }
        ],
        learn: '<h3>Percentages</h3><p><strong>Percent</strong> = out of 100. 35% = 0.35.</p><div class="key-point"><strong>Of an amount:</strong> 15% of 80 = 0.15 \u00d7 80 = 12</div><div class="key-point"><strong>Increase:</strong> \u00d7 1.20 for +20%.<br><strong>Decrease:</strong> \u00d7 0.80 for -20%.</div><p><strong>Reverse:</strong> After 25% increase, price is \u00a3150. Original = 150 \u00f7 1.25 = \u00a3120.</p>',
        examples: [
          { problem: '30% of 250', solution: '<span class="step">0.30 \u00d7 250 = 75</span>',
            visual: { fn: 'percentBar', opts: { total: 250, percent: 30, label: '30% of 250' } } },
          { problem: 'Increase \u00a380 by 15%', solution: '<span class="step">80 \u00d7 1.15 = \u00a392</span>',
            visual: { fn: 'percentBar', opts: { total: 80, percent: 115, label: '80 + 15%' } } },
          { problem: '10% discount on \u00a3200', solution: '<span class="step">200 \u00d7 0.90 = \u00a3180</span>',
            visual: { fn: 'percentBar', opts: { total: 200, percent: 90, label: '200 - 10%' } } }
        ],
        quiz: [
          { q: '25% of 120 = ?', type: 'input', answer: '30',
            visual: { fn: 'percentBar', opts: { total: 120, percent: 25, label: '25% of 120' } } },
          { q: 'Increase 50 by 10%', type: 'input', answer: '55',
            visual: { fn: 'percentBar', opts: { total: 50, percent: 110, label: '50 + 10%' } } },
          { q: 'Decrease 200 by 30%', type: 'mc', options: ['60', '140', '170', '130'], answer: 1,
            visual: { fn: 'percentBar', opts: { total: 200, percent: 70, label: '200 - 30%' } } },
          { q: 'After 20% increase, price = \u00a360. Original?', type: 'input', answer: '50',
            visual: { fn: 'percentBar', opts: { total: 60, percent: 100, label: '\u00a360 = 120% of ?' } } }
        ]
      }
    ]
  },
  {
    id: 'ks3geom', name: 'KS3: Geometry & Measures', icon: '\ud83d\udcd0', color: '#10b981',
    desc: 'Area, volume, angles, Pythagoras and transformations.',
    topics: [
      {
        id: 'ks3g1', code: 'KS3-G1', name: 'Area & perimeter',
        learnVisuals: [
          { fn: 'shape', opts: { type: 'rectangle', w: 8, h: 4 } },
          { fn: 'shape', opts: { type: 'triangle', w: 10, h: 6 } },
          { fn: 'shape', opts: { type: 'circle', w: 7 } }
        ],
        learn: '<h3>Area & Perimeter</h3><div class="key-point"><strong>Rectangle:</strong> A = l\u00d7w, P = 2(l+w).<br><strong>Triangle:</strong> A = \u00bdbase\u00d7height.<br><strong>Parallelogram:</strong> A = base\u00d7height.<br><strong>Trapezium:</strong> A = \u00bd(a+b)\u00d7h.<br><strong>Circle:</strong> A = \u03c0r\u00b2, C = 2\u03c0r.</div>',
        examples: [
          { problem: 'Triangle: base 10, height 6', solution: '<span class="step">\u00bd \u00d7 10 \u00d7 6 = 30 cm\u00b2</span>',
            visual: { fn: 'shape', opts: { type: 'triangle', w: 10, h: 6 } } },
          { problem: 'Circle circumference, r=7', solution: '<span class="step">2\u03c0(7) = 14\u03c0 \u2248 43.98 cm</span>',
            visual: { fn: 'shape', opts: { type: 'circle', w: 7 } } },
          { problem: 'Trapezium: a=5, b=9, h=4', solution: '<span class="step">\u00bd(5+9)\u00d74 = 28 cm\u00b2</span>',
            visual: { fn: 'shape', opts: { type: 'trapezium', w: 0, h: 0, labels: { a: 5, b: 9, ht: 4 } } } }
        ],
        quiz: [
          { q: 'Area of rectangle 12cm \u00d7 5cm = ?', type: 'input', answer: '60',
            visual: { fn: 'shape', opts: { type: 'rectangle', w: 12, h: 5 } } },
          { q: 'Area of triangle: base=8, height=3', type: 'input', answer: '12',
            visual: { fn: 'shape', opts: { type: 'triangle', w: 8, h: 3 } } },
          { q: 'Circumference of circle diameter 10cm (\u03c0\u22483.14)', type: 'mc', options: ['31.4 cm', '78.5 cm', '15.7 cm', '62.8 cm'], answer: 0,
            visual: { fn: 'shape', opts: { type: 'circle', w: 5, labels: { d: 10 } } } },
          { q: 'Perimeter of rectangle 7cm \u00d7 4cm?', type: 'input', answer: '22',
            visual: { fn: 'shape', opts: { type: 'rectangle', w: 7, h: 4 } } }
        ]
      },
      {
        id: 'ks3g2', code: 'KS3-G2', name: 'Angles',
        learnVisuals: [
          { fn: 'angleLine', opts: { angle1: 65, angle2: 115, type: 'straight' } },
          { fn: 'angleLine', opts: { type: 'polygon', sides: 5 } }
        ],
        learn: '<h3>Angles</h3><div class="key-point"><strong>Key facts:</strong> Straight line = 180\u00b0. Point = 360\u00b0. Vertically opposite = equal. Triangle = 180\u00b0. Quadrilateral = 360\u00b0.</div><div class="key-point"><strong>Parallel lines:</strong> Alternate = equal (Z). Corresponding = equal (F). Co-interior = 180\u00b0 (C).</div><p>Polygon interior sum = (n-2) \u00d7 180\u00b0.</p>',
        examples: [
          { problem: 'Angles in a pentagon', solution: '<span class="step">(5-2) \u00d7 180 = 540\u00b0</span>',
            visual: { fn: 'angleLine', opts: { type: 'polygon', sides: 5 } } },
          { problem: 'Two angles on a line: 65\u00b0 and x\u00b0', solution: '<span class="step">x = 180-65 = 115\u00b0</span>',
            visual: { fn: 'angleLine', opts: { angle1: 65, angle2: '?', type: 'straight' } } }
        ],
        quiz: [
          { q: 'Angles in a triangle sum to?', type: 'mc', options: ['90\u00b0', '180\u00b0', '270\u00b0', '360\u00b0'], answer: 1,
            visual: { fn: 'angleLine', opts: { angle1: '?', type: 'triangle' } } },
          { q: 'Angle on straight line: one angle is 110\u00b0. Other = ?', type: 'input', answer: '70',
            visual: { fn: 'angleLine', opts: { angle1: 110, angle2: '?', type: 'straight' } } },
          { q: 'Interior angle sum of hexagon (6 sides)?', type: 'input', answer: '720',
            visual: { fn: 'angleLine', opts: { type: 'polygon', sides: 6 } } },
          { q: 'Two vertically opposite angles. One is 45\u00b0. Other = ?', type: 'mc', options: ['45\u00b0', '135\u00b0', '90\u00b0', '180\u00b0'], answer: 0,
            visual: { fn: 'angleLine', opts: { angle1: 45, type: 'vertically_opposite' } } }
        ]
      }
    ]
  },
  {
    id: 'ks3prob', name: 'KS3: Probability & Statistics', icon: '\ud83c\udfb2', color: '#a855f7',
    desc: 'Probability, data representation, and statistical measures.',
    topics: [
      {
        id: 'ks3p1', code: 'KS3-P1', name: 'Probability',
        learnVisuals: [
          { fn: 'dice', opts: { face: 3 } },
          { fn: 'bag', opts: { red: 3, blue: 5, green: 2 } }
        ],
        learn: '<h3>Probability</h3><p>Probability: <strong>0</strong> (impossible) to <strong>1</strong> (certain).</p><div class="key-point"><strong>P(event) = favourable \u00f7 total.</strong> All probabilities sum to 1.</div>',
        examples: [
          { problem: 'P(rolling 3) on fair die', solution: '<span class="step">P = 1/6</span>',
            visual: { fn: 'dice', opts: { face: 3 } } },
          { problem: 'Bag: 3 red, 5 blue, 2 green. P(blue)?', solution: '<span class="step">P = 5/10 = 1/2</span>',
            visual: { fn: 'bag', opts: { red: 3, blue: 5, green: 2 } } }
        ],
        quiz: [
          { q: 'P(heads) on fair coin?', type: 'mc', options: ['1/4', '1/2', '1/3', '1'], answer: 1,
            visual: { fn: 'coin', opts: {} } },
          { q: 'P(event) = 0.7. P(not event) = ?', type: 'input', answer: '0.3',
            visual: { fn: 'percentBar', opts: { total: 1, percent: 70, label: '0.7' } } },
          { q: 'Bag: 4 red, 6 blue. P(red)?', type: 'mc', options: ['2/5', '4/6', '1/4', '4/10'], answer: 0,
            visual: { fn: 'bag', opts: { red: 4, blue: 6 } } },
          { q: 'Two coins flipped. P(both heads)?', type: 'mc', options: ['1/2', '1/3', '1/4', '1/8'], answer: 2,
            visual: { fn: 'twoCoins', opts: {} } }
        ]
      },
      {
        id: 'ks3s1', code: 'KS3-S1', name: 'Averages & data',
        learnVisuals: [
          { fn: 'dataSet', opts: { values: [3, 7, 5, 9, 6] } }
        ],
        learn: '<h3>Averages & Data</h3><div class="key-point"><strong>Mean:</strong> Sum \u00f7 count.<br><strong>Median:</strong> Middle value (ordered).<br><strong>Mode:</strong> Most frequent.<br><strong>Range:</strong> Max \u2212 min.</div>',
        examples: [
          { problem: 'Mean of 3,7,5,9,6', solution: '<span class="step">30\u00f75 = 6</span>',
            visual: { fn: 'dataSet', opts: { values: [3, 7, 5, 9, 6] } } },
          { problem: 'Median of 2,8,4,9,1', solution: '<span class="step">Ordered: 1,2,4,8,9. Middle = 4</span>',
            visual: { fn: 'dataSet', opts: { values: [1, 2, 4, 8, 9], highlight: 2 } } }
        ],
        quiz: [
          { q: 'Mean of 10, 20, 30?', type: 'input', answer: '20',
            visual: { fn: 'dataSet', opts: { values: [10, 20, 30] } } },
          { q: 'Median of 1, 3, 3, 6, 7, 8, 9?', type: 'input', answer: '6',
            visual: { fn: 'dataSet', opts: { values: [1, 3, 3, 6, 7, 8, 9], highlight: 3 } } },
          { q: 'Mode of 2, 4, 4, 5, 7?', type: 'mc', options: ['2', '4', '5', '7'], answer: 1,
            visual: { fn: 'dataSet', opts: { values: [2, 4, 4, 5, 7] } } },
          { q: 'Range of 3, 8, 15, 1, 6?', type: 'input', answer: '14',
            visual: { fn: 'dataSet', opts: { values: [3, 8, 15, 1, 6] } } }
        ]
      }
    ]
  }
];
