// Curriculum data extracted from:
// - Maths_guidance_year_6.pdf (DfE, June 2020)
// - SECONDARY_national_curriculum_-_Mathematics.pdf (DfE, Sept 2013)

const STRANDS = [
  {
    id: 'npv',
    name: 'Number & Place Value',
    icon: '🔢',
    color: '#6366f1',
    desc: 'Understand powers of 10, compose numbers to 10 million, and work with the number line.',
    topics: [
      {
        id: '6npv1', code: '6NPV-1', name: 'Powers of 10',
        learn: '<h3>Powers of 10</h3><p>Every place in our number system is <strong>10 times</strong> the value of the place to its right, and <strong>one tenth</strong> the value of the place to its left.</p><div class="key-point"><strong>Key idea:</strong> Moving a digit one column left makes it 10× bigger. Moving right makes it 10× smaller.</div><p>The powers of 10: 0.01 → 0.1 → 1 → 10 → 100 → 1,000 → 10,000 → 100,000 → 1,000,000 → 10,000,000</p><div class="key-point"><strong>Multiplying by 10, 100, 1000:</strong> Shifts digits left by 1, 2, or 3 places.<br><strong>Dividing by 10, 100, 1000:</strong> Shifts digits right by 1, 2, or 3 places.</div><p>Example: 45 × 10 = 450. And 3,200 ÷ 100 = 32.</p>',
        examples: [
          { problem: '36 × 100 = ?', solution: '<span class="step">Move digits 2 places left: 36 → 3,600</span>' },
          { problem: '5,400 ÷ 1,000 = ?', solution: '<span class="step">Move digits 3 places right: 5,400 → 5.4</span>' },
          { problem: 'Make 0.7 one hundred times bigger', solution: '<span class="step">0.7 × 100 = 70</span>' }
        ],
        quiz: [
          { q: 'What is 250 × 10?', type: 'mc', options: ['2,500', '250', '25,000', '25'], answer: 0 },
          { q: 'What is 8,000 ÷ 100?', type: 'mc', options: ['800', '8', '80', '0.8'], answer: 2 },
          { q: 'What is 0.03 × 1,000?', type: 'input', answer: '30' },
          { q: 'What is 4,500,000 ÷ 1,000?', type: 'input', answer: '4500' }
        ]
      },
      {
        id: '6npv2', code: '6NPV-2', name: 'Compose & decompose numbers to 10 million',
        learn: '<h3>Composing & Decomposing Numbers</h3><p>Every number can be broken into its <strong>place-value parts</strong>. This is called <em>decomposing</em>. Putting parts back together is <em>composing</em>.</p><div class="key-point"><strong>Standard partitioning:</strong> 5,034,000.2 = 5,000,000 + 30,000 + 4,000 + 0.2</div><p>Non-standard partitioning: 548.32 = 500 + 48 + 0.32</p><div class="key-point"><strong>Why it matters:</strong> Decomposing helps with mental arithmetic and comparing numbers.</div>',
        examples: [
          { problem: 'Value of 5 in 7,205,041?', solution: '<span class="step">5 is in the thousands column → 5,000</span>' },
          { problem: 'Decompose 3,408,600', solution: '<span class="step">3,000,000 + 400,000 + 8,000 + 600</span>' },
          { problem: '381,920 − 900 = ?', solution: '<span class="step">Remove 900 from hundreds: 381,020</span>' }
        ],
        quiz: [
          { q: 'What is the value of 6 in 2,603,100?', type: 'mc', options: ['600', '6,000', '60,000', '600,000'], answer: 3 },
          { q: 'Which is larger: 7,142,294 or 7,124,294?', type: 'mc', options: ['7,142,294', '7,124,294', 'They are equal'], answer: 0 },
          { q: '5,000,000 + 30,000 + 200 + 0.5 = ?', type: 'input', answer: '5030200.5' },
          { q: '4,820,000 − 20,000 = ?', type: 'input', answer: '4800000' }
        ]
      },
      {
        id: '6npv3', code: '6NPV-3', name: 'Numbers on the number line (to 10 million)',
        learn: '<h3>Numbers on the Number Line</h3><p>You need to place numbers up to <strong>10 million</strong> on a number line and estimate positions.</p><div class="key-point"><strong>Rounding:</strong> Find the previous and next multiple, then decide which is closer. E.g. 5,192,012 rounded to the nearest million is 5,000,000.</div><p>Count forwards and backwards in steps of powers of 10. Watch boundaries: 2,100,000 → 2,000,000 → 1,900,000.</p>',
        examples: [
          { problem: 'Round 5,192,012 to nearest million', solution: '<span class="step">Previous: 5,000,000. Next: 6,000,000.</span><span class="step">Closer to 5,000,000 → Answer: 5,000,000</span>' },
          { problem: 'Round 5,192,012 to nearest 100,000', solution: '<span class="step">Previous: 5,100,000. Next: 5,200,000.</span><span class="step">Closer to 5,200,000 → Answer: 5,200,000</span>' }
        ],
        quiz: [
          { q: 'Round 3,782,000 to the nearest million', type: 'mc', options: ['3,000,000', '4,000,000', '3,800,000'], answer: 1 },
          { q: 'What comes next? 2,100,000 → 2,000,000 → ?', type: 'input', answer: '1900000' },
          { q: 'Round 6,450,000 to the nearest million', type: 'mc', options: ['6,000,000', '7,000,000', '6,500,000'], answer: 1 },
          { q: 'Round 8,349,999 to nearest 100,000', type: 'input', answer: '8300000' }
        ]
      },
      {
        id: '6npv4', code: '6NPV-4', name: 'Divide powers of 10 & read scales',
        learn: '<h3>Dividing Powers of 10 & Reading Scales</h3><p>Divide powers of 10 into <strong>2, 4, 5 and 10</strong> equal parts.</p><div class="key-point"><strong>Example:</strong> 1,000 ÷ 4 = 250. Scale 0–1,000 in 4 parts: 0, 250, 500, 750, 1,000.</div><p>Essential for reading rulers, thermometers, measuring jugs, and graphs.</p>',
        examples: [
          { problem: 'Divide 1,000,000 into 5 equal parts', solution: '<span class="step">1,000,000 ÷ 5 = 200,000</span><span class="step">Marks: 0, 200k, 400k, 600k, 800k, 1M</span>' },
          { problem: 'Scale 0–100, 4 divisions. Each interval?', solution: '<span class="step">100 ÷ 4 = 25</span>' }
        ],
        quiz: [
          { q: '10,000 ÷ 5 = ?', type: 'input', answer: '2000' },
          { q: 'Scale 0–1,000 in 4 parts. Second mark value?', type: 'mc', options: ['200', '250', '500', '400'], answer: 2 },
          { q: '0.1 ÷ 10 = ?', type: 'input', answer: '0.01' },
          { q: '1,000,000 ÷ 4 = ?', type: 'input', answer: '250000' }
        ]
      }
    ]
  },
  {
    id: 'asmd',
    name: 'Arithmetic & Structure',
    icon: '➖',
    color: '#8b5cf6',
    desc: 'Additive and multiplicative relationships, deriving calculations, ratio, and unknowns.',
    topics: [
      {
        id: '6asmd1', code: '6AS/MD-1', name: 'Additive vs multiplicative relationships',
        learn: '<h3>Additive vs Multiplicative</h3><p>Two numbers can be related <strong>additively</strong> (by adding/subtracting) or <strong>multiplicatively</strong> (by multiplying/dividing).</p><div class="key-point"><strong>Additive:</strong> 75 = 3 + 72. The difference is 72.<br><strong>Multiplicative:</strong> 75 = 3 × 25. One is 25 times the other.</div><p>Recognising which type of relationship applies helps you choose the right operation to solve a problem.</p><div class="key-point"><strong>Sequences:</strong> If each term increases by the same amount, the relationship is additive. If each term is multiplied by the same factor, it is multiplicative.</div>',
        examples: [
          { problem: '4 and 16: additive and multiplicative?', solution: '<span class="step">Additive: 4 + 12 = 16 (difference is 12)</span><span class="step">Multiplicative: 4 × 4 = 16 (factor is 4)</span>' },
          { problem: 'Sequence: 0.5, 5, ?, ?', solution: '<span class="step">Multiplicative: ×10 each time</span><span class="step">0.5, 5, 50, 500</span>' }
        ],
        quiz: [
          { q: '300 × ? = 1,200', type: 'input', answer: '4' },
          { q: '300 + ? = 1,200', type: 'input', answer: '900' },
          { q: 'Is 2, 6, 18, 54 additive or multiplicative?', type: 'mc', options: ['Additive', 'Multiplicative'], answer: 1 },
          { q: 'Continue: 25, 125, 625, ?', type: 'input', answer: '3125' }
        ]
      },
      {
        id: '6asmd2', code: '6AS/MD-2', name: 'Derive related calculations',
        learn: '<h3>Deriving Related Calculations</h3><p>Use known facts and arithmetic properties to work out new calculations without starting from scratch.</p><div class="key-point"><strong>Compensation (addition):</strong> If one addend increases, decrease the other by the same amount. The sum stays the same.<br>25 + 35 = 27.5 + 32.5</div><div class="key-point"><strong>Compensation (multiplication):</strong> If one factor is multiplied by n, divide the other by n. The product stays the same.<br>0.3 × 320 = 3 × 32 = 96</div><p>You can also scale both factors: 3 × 4 = 12, so 30 × 40 = 1,200.</p>',
        examples: [
          { problem: 'Given 72 × 34 = 2,448. Find 72 × 340', solution: '<span class="step">340 = 34 × 10</span><span class="step">72 × 340 = 2,448 × 10 = 24,480</span>' },
          { problem: '327 + 278 = 605. So 327 + 515 = ?', solution: '<span class="step">515 = 278 + 237</span><span class="step">605 + 237 = 842</span>' }
        ],
        quiz: [
          { q: '25 × 48 = 1,200. What is 50 × 24?', type: 'input', answer: '1200' },
          { q: '256 × 85 = 21,760. What is 256 × 8.5?', type: 'input', answer: '2176' },
          { q: 'If 327 + 278 = 605, what is 330 + 275?', type: 'mc', options: ['605', '600', '610', '595'], answer: 0 },
          { q: '3 × 4 = 12. What is 30 × 40?', type: 'input', answer: '1200' }
        ]
      },
      {
        id: '6asmd3', code: '6AS/MD-3', name: 'Ratio relationships',
        learn: '<h3>Ratio Relationships</h3><p>A ratio describes a <strong>correspondence</strong> between quantities. "For every 1 cup of rice, you need 2 cups of water."</p><div class="key-point"><strong>Proportionality:</strong> The ratio stays the same no matter how much you scale up. If 1:2, then 5:10 and 10:20.</div><p>You can set up a ratio table to solve ratio problems:</p><p style="font-family:var(--mono);font-size:13px;">Rice: 1, 2, 3, 4, 5<br>Water: 2, 4, 6, 8, 10</p><div class="key-point"><strong>Many-to-many:</strong> "For every 2 yellow beads there are 3 green beads" → total in each group is 5.</div>',
        examples: [
          { problem: 'For every 1 red bead, 3 blue. 5 red = ? blue', solution: '<span class="step">1:3 ratio, so 5 red → 5 × 3 = 15 blue</span>' },
          { problem: '21 blue beads (1:3 ratio). Total beads?', solution: '<span class="step">21 blue ÷ 3 = 7 red</span><span class="step">Total = 7 + 21 = 28</span>' }
        ],
        quiz: [
          { q: 'Ratio 1:4. If there are 20 blue, how many red?', type: 'input', answer: '5' },
          { q: 'Ratio 2:3. 10 yellow beads = ? green', type: 'input', answer: '15' },
          { q: 'Ratio 1:2. 18 total. How many of the larger group?', type: 'mc', options: ['6', '9', '12', '18'], answer: 2 },
          { q: 'Smoothie: 20 strawberries for 2 people. For 5 people?', type: 'input', answer: '50' }
        ]
      },
      {
        id: '6asmd4', code: '6AS/MD-4', name: 'Problems with 2 unknowns',
        learn: '<h3>Problems with 2 Unknowns</h3><p>Some problems have <strong>two values you need to find</strong>. You are given enough information to work both out.</p><div class="key-point"><strong>Strategy:</strong> Use the relationships between the unknowns. Often you can find the difference or use substitution.</div><p>Example: 1 eraser + 5 pencils = £3.35. 5 erasers + 5 pencils = £4.75.<br>Difference = 4 erasers = £1.40, so 1 eraser = £0.35. Then 5 pencils = £3.00, so 1 pencil = £0.60.</p>',
        examples: [
          { problem: 'Adult = child + £2. 3 adults + 2 children = £33. Find prices.', solution: '<span class="step">Let child = c. Adult = c + 2.</span><span class="step">3(c+2) + 2c = 33</span><span class="step">5c + 6 = 33 → 5c = 27 → c = 5.40</span><span class="step">Child = £5.40, Adult = £7.40</span>' },
          { problem: 'Rectangle perimeter = 30cm. a is 2-digit, b is 1-digit.', solution: '<span class="step">2a + 2b = 30 → a + b = 15</span><span class="step">Possible: a=10,b=5 or a=11,b=4 or a=12,b=3 or a=13,b=2 or a=14,b=1</span>' }
        ],
        quiz: [
          { q: 'a + b = 10, a = 3b. What is a?', type: 'input', answer: '7.5' },
          { q: 'x + y = 20, x − y = 4. What is x?', type: 'input', answer: '12' },
          { q: '2 small + 1 large box = 26 cakes. 1 small box = 5. Large = ?', type: 'input', answer: '16' },
          { q: 'Perimeter = 20cm. Length is 3× width. Width = ?', type: 'mc', options: ['2.5 cm', '5 cm', '3 cm', '4 cm'], answer: 0 }
        ]
      }
    ]
  },
  {
    id: 'frac',
    name: 'Fractions',
    icon: '½',
    color: '#ec4899',
    desc: 'Simplify fractions, find common denominators, and compare fractions using reasoning.',
    topics: [
      {
        id: '6f1', code: '6F-1', name: 'Simplify fractions',
        learn: '<h3>Simplifying Fractions</h3><p>A fraction is in its <strong>simplest form</strong> when the numerator and denominator have no common factor other than 1.</p><div class="key-point"><strong>To simplify:</strong> Divide both numerator and denominator by their highest common factor (HCF).</div><p>Example: 6/15. HCF of 6 and 15 is 3. So 6÷3 = 2 and 15÷3 = 5. Result: 2/5.</p><div class="key-point"><strong>Always check:</strong> After simplifying, confirm no common factors remain.</div><p>Simplifying does NOT change the value — the fraction keeps its position on the number line.</p>',
        examples: [
          { problem: 'Simplify 4/12', solution: '<span class="step">HCF of 4 and 12 = 4</span><span class="step">4÷4 = 1, 12÷4 = 3</span><span class="step">Answer: 1/3</span>' },
          { problem: 'Simplify 15/20', solution: '<span class="step">HCF of 15 and 20 = 5</span><span class="step">15÷5 = 3, 20÷5 = 4</span><span class="step">Answer: 3/4</span>' }
        ],
        quiz: [
          { q: 'Simplify 6/18', type: 'input', answer: '1/3' },
          { q: 'Simplify 8/12', type: 'mc', options: ['4/6', '2/3', '3/4', '1/2'], answer: 1 },
          { q: 'Is 7/21 in simplest form?', type: 'mc', options: ['Yes', 'No — it simplifies to 1/3'], answer: 1 },
          { q: 'Simplify 25/100', type: 'input', answer: '1/4' }
        ]
      },
      {
        id: '6f2', code: '6F-2', name: 'Common denomination & compare',
        learn: '<h3>Common Denominators</h3><p>To compare or add fractions with different denominators, express them with a <strong>common denominator</strong>.</p><div class="key-point"><strong>If one denominator divides the other:</strong> Use the larger one. E.g. 1/5 and 4/15 → use 15. 1/5 = 3/15.</div><div class="key-point"><strong>Otherwise:</strong> Multiply the two denominators. E.g. 1/3 and 3/8 → use 24. 1/3 = 8/24, 3/8 = 9/24.</div><p>Once fractions share a denominator, you can directly compare numerators.</p>',
        examples: [
          { problem: 'Compare 1/5 and 4/15', solution: '<span class="step">15 is a multiple of 5, so use 15</span><span class="step">1/5 = 3/15</span><span class="step">3/15 < 4/15, so 1/5 < 4/15</span>' },
          { problem: 'Compare 1/3 and 3/8', solution: '<span class="step">Common denom: 3×8 = 24</span><span class="step">1/3 = 8/24, 3/8 = 9/24</span><span class="step">8/24 < 9/24, so 1/3 < 3/8</span>' }
        ],
        quiz: [
          { q: 'Express 2/3 with denominator 12', type: 'input', answer: '8/12' },
          { q: 'Which is larger: 3/7 or 5/8?', type: 'mc', options: ['3/7', '5/8'], answer: 1 },
          { q: 'Common denominator for 1/4 and 1/6?', type: 'mc', options: ['10', '12', '24', '8'], answer: 1 },
          { q: '5/6 or 7/9 — which is larger?', type: 'mc', options: ['5/6', '7/9', 'They are equal'], answer: 0 }
        ]
      },
      {
        id: '6f3', code: '6F-3', name: 'Compare fractions by reasoning',
        learn: '<h3>Comparing Fractions by Reasoning</h3><p>You don\'t always need common denominators. Use <strong>reasoning</strong> to compare.</p><div class="key-point"><strong>Same numerator:</strong> Larger denominator = smaller fraction. E.g. 2/5 > 2/6.</div><div class="key-point"><strong>Close to 1:</strong> 7/8 is 1/8 away from 1. 6/7 is 1/7 away. Since 1/8 < 1/7, 7/8 is closer to 1, so 7/8 > 6/7.</div><p>Think: Is this fraction more or less than 1/2? Close to 0 or to 1?</p>',
        examples: [
          { problem: 'Compare 3/5 and 3/8', solution: '<span class="step">Same numerator (3). Larger denominator = smaller fraction.</span><span class="step">3/5 > 3/8</span>' },
          { problem: 'Compare 5/6 and 7/11', solution: '<span class="step">5/6: large part of whole (5 out of 6)</span><span class="step">7/11: smaller part (7 out of 11)</span><span class="step">5/6 > 7/11</span>' }
        ],
        quiz: [
          { q: 'Which is larger: 1/5 or 1/8?', type: 'mc', options: ['1/5', '1/8'], answer: 0 },
          { q: 'Which is larger: 7/8 or 6/7?', type: 'mc', options: ['7/8', '6/7', 'They are equal'], answer: 0 },
          { q: 'Order smallest to largest: 3/3, 3/8, 3/5', type: 'mc', options: ['3/8, 3/5, 3/3', '3/3, 3/5, 3/8', '3/5, 3/8, 3/3'], answer: 0 },
          { q: 'Is 4/9 more or less than 1/2?', type: 'mc', options: ['More than 1/2', 'Less than 1/2', 'Exactly 1/2'], answer: 1 }
        ]
      }
    ]
  },
  {
    id: 'geom',
    name: 'Geometry',
    icon: '△',
    color: '#14b8a6',
    desc: 'Draw, compose and decompose shapes using dimensions, angles and area.',
    topics: [
      {
        id: '6g1', code: '6G-1', name: 'Draw, compose & decompose shapes',
        learn: '<h3>Shapes: Draw, Compose & Decompose</h3><p>You should be able to draw shapes to meet given measurements (perimeter, area, angles) and break complex shapes into simpler ones.</p><div class="key-point"><strong>Composing:</strong> Joining simple shapes (rectangles, triangles) to form compound shapes.</div><div class="key-point"><strong>Decomposing:</strong> Breaking a compound shape into rectangles and triangles to find area or perimeter.</div><p>Example: Draw a rectangle with perimeter 14cm. If width = 2cm, then length = 5cm (since 2+5+2+5 = 14).</p><p>At KS3 you will use decomposition to find area of trapezia and other complex shapes.</p>',
        examples: [
          { problem: 'Rectangle perimeter = 14cm. Give dimensions.', solution: '<span class="step">Half perimeter = 7</span><span class="step">Possible: 1×6, 2×5, 3×4</span>' },
          { problem: 'Pentagon area = 10cm² on squared paper', solution: '<span class="step">Use a combination of full and half squares</span><span class="step">E.g. 8 full squares + 4 half-squares = 10cm²</span>' },
          { problem: '3 identical small rectangles (5cm × ?cm) form a large rectangle 15cm wide. Perimeter of large?', solution: '<span class="step">3 rectangles side by side: width = 5, length = 3×L</span><span class="step">15 = 3L → L = 5, so each is 5×5 (square)</span><span class="step">Large rect: 15×5. Perimeter = 2(15+5) = 40cm</span>' }
        ],
        quiz: [
          { q: 'Rectangle perimeter = 20cm. Width = 3cm. Length = ?', type: 'input', answer: '7' },
          { q: 'Square area = 64cm². Side length = ?', type: 'input', answer: '8' },
          { q: 'Triangle: base=6cm, height=4cm. Area = ?', type: 'mc', options: ['24 cm²', '12 cm²', '10 cm²', '20 cm²'], answer: 1 },
          { q: 'Rectangle 8cm × 5cm. Perimeter = ?', type: 'input', answer: '26' }
        ]
      }
    ]
  },
  {
    id: 'ks3num',
    name: 'KS3: Number',
    icon: '#️⃣',
    color: '#f59e0b',
    desc: 'Extend number skills: primes, factors, standard form, and four operations with negatives and decimals.',
    topics: [
      {
        id: 'ks3n1', code: 'KS3-N1', name: 'Primes, factors & multiples',
        learn: '<h3>Primes, Factors & Multiples</h3><p>A <strong>prime number</strong> has exactly 2 factors: 1 and itself. The first primes are 2, 3, 5, 7, 11, 13...</p><div class="key-point"><strong>HCF:</strong> Highest Common Factor — largest number that divides both. E.g. HCF(12,18) = 6.<br><strong>LCM:</strong> Lowest Common Multiple — smallest number both divide into. E.g. LCM(4,6) = 12.</div><p><strong>Prime factorisation:</strong> Express a number as a product of primes. 60 = 2 × 2 × 3 × 5 = 2² × 3 × 5.</p>',
        examples: [
          { problem: 'Prime factorisation of 36', solution: '<span class="step">36 = 2 × 18 = 2 × 2 × 9 = 2 × 2 × 3 × 3 = 2² × 3²</span>' },
          { problem: 'HCF(24, 36)', solution: '<span class="step">24 = 2³ × 3, 36 = 2² × 3²</span><span class="step">HCF = 2² × 3 = 12</span>' },
          { problem: 'LCM(4, 6)', solution: '<span class="step">Multiples of 4: 4, 8, 12, 16...</span><span class="step">Multiples of 6: 6, 12, 18...</span><span class="step">LCM = 12</span>' }
        ],
        quiz: [
          { q: 'Is 27 prime?', type: 'mc', options: ['Yes', 'No'], answer: 1 },
          { q: 'HCF(16, 24) = ?', type: 'input', answer: '8' },
          { q: 'LCM(3, 5) = ?', type: 'input', answer: '15' },
          { q: 'Prime factorisation of 30?', type: 'mc', options: ['2 × 3 × 5', '5 × 6', '2 × 15', '3 × 10'], answer: 0 }
        ]
      },
      {
        id: 'ks3n2', code: 'KS3-N2', name: 'Operations with negatives & decimals',
        learn: '<h3>Operations with Negatives & Decimals</h3><p>At KS3 you work with the <strong>four operations</strong> applied to integers, decimals, and fractions — both positive and negative.</p><div class="key-point"><strong>Negative rules:</strong><br>Positive × Negative = Negative<br>Negative × Negative = Positive<br>Same rules apply for division.</div><div class="key-point"><strong>Order of operations:</strong> BIDMAS — Brackets, Indices, Division/Multiplication, Addition/Subtraction.</div>',
        examples: [
          { problem: '-3 × -4 = ?', solution: '<span class="step">Negative × Negative = Positive</span><span class="step">Answer: 12</span>' },
          { problem: '2 + 3 × 4 = ?', solution: '<span class="step">Multiplication first: 3 × 4 = 12</span><span class="step">Then add: 2 + 12 = 14</span>' }
        ],
        quiz: [
          { q: '-5 × 3 = ?', type: 'input', answer: '-15' },
          { q: '-8 ÷ -2 = ?', type: 'input', answer: '4' },
          { q: '10 - 3 × 4 = ?', type: 'mc', options: ['28', '-2', '22', '-12'], answer: 1 },
          { q: '(-2)³ = ?', type: 'input', answer: '-8' }
        ]
      }
    ]
  },
  {
    id: 'ks3alg',
    name: 'KS3: Algebra',
    icon: '𝑥',
    color: '#06b6d4',
    desc: 'Expressions, equations, sequences, and graphs.',
    topics: [
      {
        id: 'ks3a1', code: 'KS3-A1', name: 'Expressions & equations',
        learn: '<h3>Expressions & Equations</h3><p>An <strong>expression</strong> uses letters and numbers (e.g. 3x + 2). An <strong>equation</strong> says two expressions are equal (e.g. 3x + 2 = 14).</p><div class="key-point"><strong>Simplify:</strong> Collect like terms. 2a + 3b + 5a = 7a + 3b</div><div class="key-point"><strong>Solve:</strong> Find the value of the unknown. 3x + 2 = 14 → 3x = 12 → x = 4</div><p>Use inverse operations to isolate the variable: undo addition with subtraction, undo multiplication with division.</p>',
        examples: [
          { problem: 'Simplify: 4x + 3 + 2x - 1', solution: '<span class="step">Collect like terms: (4x + 2x) + (3 - 1) = 6x + 2</span>' },
          { problem: 'Solve: 5x - 3 = 22', solution: '<span class="step">5x = 22 + 3 = 25</span><span class="step">x = 25 ÷ 5 = 5</span>' }
        ],
        quiz: [
          { q: 'Simplify: 3a + 2a + 4', type: 'mc', options: ['5a + 4', '9a', '3a + 6', '5a4'], answer: 0 },
          { q: 'Solve: 2x + 6 = 20. x = ?', type: 'input', answer: '7' },
          { q: 'Expand: 3(x + 4) = ?', type: 'mc', options: ['3x + 4', '3x + 12', 'x + 12', '3x + 7'], answer: 1 },
          { q: 'Solve: 4x - 8 = 0. x = ?', type: 'input', answer: '2' }
        ]
      },
      {
        id: 'ks3a2', code: 'KS3-A2', name: 'Sequences',
        learn: '<h3>Sequences</h3><p>A <strong>sequence</strong> is an ordered list of numbers following a rule.</p><div class="key-point"><strong>Arithmetic sequence:</strong> Add the same number each time (common difference).<br>E.g. 3, 7, 11, 15... (common difference = 4)</div><div class="key-point"><strong>nth term:</strong> For the sequence above, nth term = 4n - 1.<br>Check: n=1 → 4(1)-1 = 3 ✓, n=2 → 4(2)-1 = 7 ✓</div><p><strong>Geometric sequences</strong> multiply by the same ratio each time. E.g. 2, 6, 18, 54... (×3)</p>',
        examples: [
          { problem: 'Find nth term: 5, 8, 11, 14...', solution: '<span class="step">Common difference = 3</span><span class="step">nth term = 3n + 2</span><span class="step">Check: n=1 → 5 ✓, n=2 → 8 ✓</span>' },
          { problem: 'Next 2 terms: 2, 6, 18, 54...', solution: '<span class="step">Geometric: ×3 each time</span><span class="step">54 × 3 = 162, 162 × 3 = 486</span>' }
        ],
        quiz: [
          { q: 'Next term: 4, 9, 14, 19, ?', type: 'input', answer: '24' },
          { q: 'nth term of 2, 5, 8, 11?', type: 'mc', options: ['3n - 1', '3n + 2', 'n + 3', '2n + 1'], answer: 0 },
          { q: 'Geometric: 3, 12, 48, ?', type: 'input', answer: '192' },
          { q: '10th term of 3n + 1?', type: 'input', answer: '31' }
        ]
      }
    ]
  },
  {
    id: 'ks3ratio',
    name: 'KS3: Ratio & Proportion',
    icon: '⚖️',
    color: '#f97316',
    desc: 'Percentages, proportion, unit conversions and compound units.',
    topics: [
      {
        id: 'ks3r1', code: 'KS3-R1', name: 'Percentages',
        learn: '<h3>Percentages</h3><p><strong>Percent</strong> means "out of 100". So 35% = 35/100 = 0.35.</p><div class="key-point"><strong>Finding a percentage of an amount:</strong> 15% of 80 = 0.15 × 80 = 12</div><div class="key-point"><strong>Percentage increase:</strong> Increase 60 by 20% → 60 × 1.20 = 72<br><strong>Percentage decrease:</strong> Decrease 60 by 20% → 60 × 0.80 = 48</div><p><strong>Finding the original:</strong> After a 25% increase, the price is £150. Original = 150 ÷ 1.25 = £120.</p>',
        examples: [
          { problem: '30% of 250', solution: '<span class="step">0.30 × 250 = 75</span>' },
          { problem: 'Increase £80 by 15%', solution: '<span class="step">80 × 1.15 = £92</span>' },
          { problem: 'Price after 10% discount on £200', solution: '<span class="step">200 × 0.90 = £180</span>' }
        ],
        quiz: [
          { q: '25% of 120 = ?', type: 'input', answer: '30' },
          { q: 'Increase 50 by 10%', type: 'input', answer: '55' },
          { q: 'Decrease 200 by 30%', type: 'mc', options: ['60', '140', '170', '130'], answer: 1 },
          { q: 'After 20% increase, price = £60. Original?', type: 'input', answer: '50' }
        ]
      }
    ]
  },
  {
    id: 'ks3geom',
    name: 'KS3: Geometry & Measures',
    icon: '📐',
    color: '#10b981',
    desc: 'Area, volume, angles, Pythagoras and transformations.',
    topics: [
      {
        id: 'ks3g1', code: 'KS3-G1', name: 'Area & perimeter',
        learn: '<h3>Area & Perimeter</h3><div class="key-point"><strong>Rectangle:</strong> Area = l × w. Perimeter = 2(l + w).<br><strong>Triangle:</strong> Area = ½ × base × height.<br><strong>Parallelogram:</strong> Area = base × height.<br><strong>Trapezium:</strong> Area = ½(a + b) × h</div><div class="key-point"><strong>Circle:</strong> Area = πr². Circumference = 2πr = πd.</div><p>For compound shapes, decompose into simpler shapes and add/subtract areas.</p>',
        examples: [
          { problem: 'Area of triangle: base 10cm, height 6cm', solution: '<span class="step">½ × 10 × 6 = 30 cm²</span>' },
          { problem: 'Circumference of circle, radius 7cm', solution: '<span class="step">2 × π × 7 = 14π ≈ 43.98 cm</span>' },
          { problem: 'Area of trapezium: a=5, b=9, h=4', solution: '<span class="step">½(5 + 9) × 4 = ½ × 14 × 4 = 28 cm²</span>' }
        ],
        quiz: [
          { q: 'Area of rectangle 12cm × 5cm = ?', type: 'input', answer: '60' },
          { q: 'Area of triangle: base=8, height=3', type: 'input', answer: '12' },
          { q: 'Circumference of circle diameter 10cm (π ≈ 3.14)', type: 'mc', options: ['31.4 cm', '78.5 cm', '15.7 cm', '62.8 cm'], answer: 0 },
          { q: 'Perimeter of rectangle 7cm × 4cm?', type: 'input', answer: '22' }
        ]
      },
      {
        id: 'ks3g2', code: 'KS3-G2', name: 'Angles',
        learn: '<h3>Angles</h3><div class="key-point"><strong>Key facts:</strong><br>Angles on a straight line = 180°<br>Angles at a point = 360°<br>Vertically opposite angles are equal<br>Angles in a triangle = 180°<br>Angles in a quadrilateral = 360°</div><div class="key-point"><strong>Parallel lines:</strong><br>Alternate angles are equal (Z-shape)<br>Corresponding angles are equal (F-shape)<br>Co-interior angles sum to 180° (C-shape)</div><p>Interior angle sum of any polygon with n sides = (n-2) × 180°.</p>',
        examples: [
          { problem: 'Angles in a pentagon', solution: '<span class="step">(5-2) × 180 = 3 × 180 = 540°</span>' },
          { problem: 'Two angles on a line: 65° and x°', solution: '<span class="step">65 + x = 180</span><span class="step">x = 115°</span>' }
        ],
        quiz: [
          { q: 'Angles in a triangle sum to?', type: 'mc', options: ['90°', '180°', '270°', '360°'], answer: 1 },
          { q: 'Angle on straight line: one angle is 110°. Other = ?', type: 'input', answer: '70' },
          { q: 'Interior angle sum of hexagon (6 sides)?', type: 'input', answer: '720' },
          { q: 'Two vertically opposite angles. One is 45°. Other = ?', type: 'mc', options: ['45°', '135°', '90°', '180°'], answer: 0 }
        ]
      }
    ]
  },
  {
    id: 'ks3prob',
    name: 'KS3: Probability & Statistics',
    icon: '🎲',
    color: '#a855f7',
    desc: 'Probability, data representation, and statistical measures.',
    topics: [
      {
        id: 'ks3p1', code: 'KS3-P1', name: 'Probability',
        learn: '<h3>Probability</h3><p>Probability measures how likely an event is, on a scale from <strong>0 (impossible)</strong> to <strong>1 (certain)</strong>.</p><div class="key-point"><strong>Formula:</strong> P(event) = favourable outcomes ÷ total outcomes</div><div class="key-point"><strong>Key rule:</strong> All probabilities sum to 1. If P(rain) = 0.3, then P(no rain) = 0.7.</div><p>Sample spaces list all possible outcomes. For 2 dice: 6 × 6 = 36 outcomes.</p>',
        examples: [
          { problem: 'P(rolling a 3) on a fair die', solution: '<span class="step">1 favourable out of 6 total</span><span class="step">P = 1/6</span>' },
          { problem: 'Bag: 3 red, 5 blue, 2 green. P(blue)?', solution: '<span class="step">Total = 10, blue = 5</span><span class="step">P(blue) = 5/10 = 1/2</span>' }
        ],
        quiz: [
          { q: 'P(heads) on fair coin?', type: 'mc', options: ['1/4', '1/2', '1/3', '1'], answer: 1 },
          { q: 'P(event) = 0.7. P(not event) = ?', type: 'input', answer: '0.3' },
          { q: 'Bag: 4 red, 6 blue. P(red)?', type: 'mc', options: ['2/5', '4/6', '1/4', '4/10'], answer: 0 },
          { q: 'Two coins flipped. P(both heads)?', type: 'mc', options: ['1/2', '1/3', '1/4', '1/8'], answer: 2 }
        ]
      },
      {
        id: 'ks3s1', code: 'KS3-S1', name: 'Averages & data',
        learn: '<h3>Averages & Data</h3><div class="key-point"><strong>Mean:</strong> Sum of values ÷ number of values.<br><strong>Median:</strong> Middle value when ordered.<br><strong>Mode:</strong> Most frequent value.<br><strong>Range:</strong> Largest − smallest.</div><p>Choose the right average: mean is affected by outliers, median is more robust, mode shows most common.</p><p>Data can be shown in bar charts, pie charts, line graphs, and scatter graphs.</p>',
        examples: [
          { problem: 'Mean of 3, 7, 5, 9, 6', solution: '<span class="step">Sum = 3+7+5+9+6 = 30</span><span class="step">Count = 5</span><span class="step">Mean = 30 ÷ 5 = 6</span>' },
          { problem: 'Median of 2, 8, 4, 9, 1', solution: '<span class="step">Ordered: 1, 2, 4, 8, 9</span><span class="step">Middle value = 4</span>' }
        ],
        quiz: [
          { q: 'Mean of 10, 20, 30?', type: 'input', answer: '20' },
          { q: 'Median of 1, 3, 3, 6, 7, 8, 9?', type: 'input', answer: '6' },
          { q: 'Mode of 2, 4, 4, 5, 7?', type: 'mc', options: ['2', '4', '5', '7'], answer: 1 },
          { q: 'Range of 3, 8, 15, 1, 6?', type: 'input', answer: '14' }
        ]
      }
    ]
  }
];
