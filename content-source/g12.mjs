import fs from 'fs';

const data = [
        {
          id: 'g12-math-nat',
          name: 'Mathematics',
          stream: 'Natural',
          units: [
            {
              id: 'g12-math-nat-u1',
              name: 'Sequences and Series',
              subUnits: [
                { id: 'g12-math-nat-u1-s1', name: 'Sequences' },
                { id: 'g12-math-nat-u1-s2', name: 'Arithmetic and Geometric Sequences' },
                { id: 'g12-math-nat-u1-s3', name: 'The Sigma Notation and Partial Sums' },
                { id: 'g12-math-nat-u1-s4', name: 'Infinite Series' },
                { id: 'g12-math-nat-u1-s5', name: 'Applications of Progressions' }
              ]
            },
            {
              id: 'g12-math-nat-u2',
              name: 'Introduction to Limits and Continuity',
              subUnits: [
                { id: 'g12-math-nat-u2-s1', name: 'Limits of Sequences of Numbers' },
                { id: 'g12-math-nat-u2-s2', name: 'Limits of Functions' },
                { id: 'g12-math-nat-u2-s3', name: 'Continuity of a Function' },
                { id: 'g12-math-nat-u2-s4', name: 'Applications of Limits' }
              ]
            },
            {
              id: 'g12-math-nat-u3',
              name: 'Introduction to Differential Calculus',
              subUnits: [
                { id: 'g12-math-nat-u3-s1', name: 'Introduction to Derivatives' },
                { id: 'g12-math-nat-u3-s2', name: 'Derivatives of Some Functions' },
                { id: 'g12-math-nat-u3-s3', name: 'Derivatives of Combinations and Compositions' }
              ]
            },
            {
              id: 'g12-math-nat-u4',
              name: 'Applications of Differential Calculus',
              subUnits: [
                { id: 'g12-math-nat-u4-s1', name: 'Extreme Values of Functions' },
                { id: 'g12-math-nat-u4-s2', name: 'The Mean Value Theorem' },
                { id: 'g12-math-nat-u4-s3', name: 'Curve Sketching' },
                { id: 'g12-math-nat-u4-s4', name: 'Optimization Problems' }
              ]
            },
            {
              id: 'g12-math-nat-u5',
              name: 'Introduction to Integral Calculus',
              subUnits: [
                { id: 'g12-math-nat-u5-s1', name: 'Integration as Reverse Process of Differentiation' },
                { id: 'g12-math-nat-u5-s2', name: 'Techniques of Integration' },
                { id: 'g12-math-nat-u5-s3', name: 'Definite Integrals and Area' },
                { id: 'g12-math-nat-u5-s4', name: 'Applications of Integral Calculus' }
              ]
            },
            {
              id: 'g12-math-nat-u6',
              name: 'Three Dimensional Geometry and Vectors in Space',
              subUnits: [
                { id: 'g12-math-nat-u6-s1', name: 'Coordinate Axes and Planes in Space' },
                { id: 'g12-math-nat-u6-s2', name: 'Distance and Mid-point Formulae in Space' },
                { id: 'g12-math-nat-u6-s3', name: 'Equation of a Sphere' },
                { id: 'g12-math-nat-u6-s4', name: 'Vectors in Space' },
                { id: 'g12-math-nat-u6-s5', name: 'Dot Product and Cross Product' }
              ]
            },
            {
              id: 'g12-math-nat-u7',
              name: 'Mathematical Proofs',
              subUnits: [
                { id: 'g12-math-nat-u7-s1', name: 'Principles of Mathematical Induction' },
                { id: 'g12-math-nat-u7-s2', name: 'Methods of Direct and Indirect Proofs' }
              ]
            }
          ]
        },
        {
          id: 'g12-phy-nat',
          name: 'Physics',
          stream: 'Natural',
          units: [
            {
              id: 'g12-phy-nat-u1',
              name: 'Thermodynamics',
              subUnits: [
                { id: 'g12-phy-nat-u1-s1', name: 'Thermal Equilibrium and Temperature' },
                { id: 'g12-phy-nat-u1-s2', name: 'Work, Heat, and First Law' },
                { id: 'g12-phy-nat-u1-s3', name: 'Kinetic Theory of Gases' },
                { id: 'g12-phy-nat-u1-s4', name: 'Second Law, Efficiency, and Entropy' },
                { id: 'g12-phy-nat-u1-s5', name: 'Heat Engines and Refrigerators' }
              ]
            },
            {
              id: 'g12-phy-nat-u2',
              name: 'Oscillations and Waves',
              subUnits: [
                { id: 'g12-phy-nat-u2-s1', name: 'Periodic Motion and SHM' },
                { id: 'g12-phy-nat-u2-s2', name: 'Wave Motion' },
                { id: 'g12-phy-nat-u2-s3', name: 'Sound, Loudness, and Human Ear' }
              ]
            },
            {
              id: 'g12-phy-nat-u3',
              name: 'Wave Optics',
              subUnits: [
                { id: 'g12-phy-nat-u3-s1', name: 'Wave Fronts and Huygens\'s Principle' },
                { id: 'g12-phy-nat-u3-s2', name: 'Reflection and Refraction of Plane Waves' },
                { id: 'g12-phy-nat-u3-s3', name: 'Interference and Diffraction' }
              ]
            },
            {
              id: 'g12-phy-nat-u4',
              name: 'Electrostatics',
              subUnits: [
                { id: 'g12-phy-nat-u4-s1', name: 'Coulomb\'s Law and Electric Fields' },
                { id: 'g12-phy-nat-u4-s2', name: 'Electric Potential' },
                { id: 'g12-phy-nat-u4-s3', name: 'Capacitors and Dielectrics' }
              ]
            },
            {
              id: 'g12-phy-nat-u5',
              name: 'Current Electricity',
              subUnits: [
                { id: 'g12-phy-nat-u5-s1', name: 'Electric Current and Ohm\'s Law' },
                { id: 'g12-phy-nat-u5-s2', name: 'Kirchhoff\'s Laws' },
                { id: 'g12-phy-nat-u5-s3', name: 'EMF and Internal Resistance' }
              ]
            },
            {
              id: 'g12-phy-nat-u6',
              name: 'Magnetism',
              subUnits: [
                { id: 'g12-phy-nat-u6-s1', name: 'Concepts of a Magnetic Field' },
                { id: 'g12-phy-nat-u6-s2', name: 'Motion of Charged Particles in Magnetic Fields' },
                { id: 'g12-phy-nat-u6-s3', name: 'Magnetic Force on Current-Carrying Conductors' },
                { id: 'g12-phy-nat-u6-s4', name: 'Ampere\'s Law' }
              ]
            },
            {
              id: 'g12-phy-nat-u7',
              name: 'Electromagnetic Induction and A.C. Circuits',
              subUnits: [
                { id: 'g12-phy-nat-u7-s1', name: 'Phenomena of Electromagnetic Induction' },
                { id: 'g12-phy-nat-u7-s2', name: 'A.C. Generators and Transformers' },
                { id: 'g12-phy-nat-u7-s3', name: 'Alternating Currents' },
                { id: 'g12-phy-nat-u7-s4', name: 'Power in A.C. Circuits' }
              ]
            },
            {
              id: 'g12-phy-nat-u8',
              name: 'Atomic Physics',
              subUnits: [
                { id: 'g12-phy-nat-u8-s1', name: 'Dual Nature of Matter and Radiation' },
                { id: 'g12-phy-nat-u8-s2', name: 'Atoms, Nuclei, and Radioactive Decay' }
              ]
            }
          ]
        },
        {
          id: 'g12-che-nat',
          name: 'Chemistry',
          stream: 'Natural',
          units: [
            {
              id: 'g12-che-nat-u1',
              name: 'Acid-Base Equilibria',
              subUnits: [
                { id: 'g12-che-nat-u1-s1', name: 'Acid-Base Concepts' },
                { id: 'g12-che-nat-u1-s2', name: 'Ionic Equilibria of Weak Acids and Bases' },
                { id: 'g12-che-nat-u1-s3', name: 'Common Ion Effect and Buffer Solutions' },
                { id: 'g12-che-nat-u1-s4', name: 'Hydrolysis of Salts' },
                { id: 'g12-che-nat-u1-s5', name: 'Acid-Base Titrations and Indicators' }
              ]
            },
            {
              id: 'g12-che-nat-u2',
              name: 'Electrochemistry',
              subUnits: [
                { id: 'g12-che-nat-u2-s1', name: 'Oxidation-Reduction Reactions' },
                { id: 'g12-che-nat-u2-s2', name: 'Galvanic (Voltaic) Cells' },
                { id: 'g12-che-nat-u2-s3', name: 'Cell Potential and Nernst Equation' },
                { id: 'g12-che-nat-u2-s4', name: 'Electrolytic Cells and Electrolysis' },
                { id: 'g12-che-nat-u2-s5', name: 'Industrial Applications and Corrosion' }
              ]
            },
            {
              id: 'g12-che-nat-u3',
              name: 'Industrial Chemistry',
              subUnits: [
                { id: 'g12-che-nat-u3-s1', name: 'Introduction to Industrial Chemical Processes' },
                { id: 'g12-che-nat-u3-s2', name: 'Production of Ammonia and Nitric Acid' },
                { id: 'g12-che-nat-u3-s3', name: 'Production of Sulfuric Acid' },
                { id: 'g12-che-nat-u3-s4', name: 'Chemical Industries in Ethiopia' }
              ]
            },
            {
              id: 'g12-che-nat-u4',
              name: 'Polymers',
              subUnits: [
                { id: 'g12-che-nat-u4-s1', name: 'Introduction to Polymers' },
                { id: 'g12-che-nat-u4-s2', name: 'Synthetic Polymers' },
                { id: 'g12-che-nat-u4-s3', name: 'Natural Polymers' }
              ]
            },
            {
              id: 'g12-che-nat-u5',
              name: 'Introduction to Environmental Chemistry',
              subUnits: [
                { id: 'g12-che-nat-u5-s1', name: 'Atmospheric, Soil, and Water Chemistry' },
                { id: 'g12-che-nat-u5-s2', name: 'Environmental Pollution' },
                { id: 'g12-che-nat-u5-s3', name: 'Global Warming and Climate Change' },
                { id: 'g12-che-nat-u5-s4', name: 'Green Chemistry and Cleaner Production' }
              ]
            }
          ]
        },
        {
          id: 'g12-bio-nat',
          name: 'Biology',
          stream: 'Natural',
          units: [
            {
              id: 'g12-bio-nat-u1',
              name: 'Micro-organisms',
              subUnits: [
                { id: 'g12-bio-nat-u1-s1', name: 'Bacteria, Viruses, and Fungi Structure' },
                { id: 'g12-bio-nat-u1-s2', name: 'Micro-organisms in Industry' },
                { id: 'g12-bio-nat-u1-s3', name: 'Micro-organisms in Medicine' }
              ]
            },
            {
              id: 'g12-bio-nat-u2',
              name: 'Ecology and Ecosystems',
              subUnits: [
                { id: 'g12-bio-nat-u2-s1', name: 'Biomes and Ecosystem Dynamics' },
                { id: 'g12-bio-nat-u2-s2', name: 'Population Dynamics' },
                { id: 'g12-bio-nat-u2-s3', name: 'Biodiversity Conservation in Ethiopia' }
              ]
            },
            {
              id: 'g12-bio-nat-u3',
              name: 'Genetics',
              subUnits: [
                { id: 'g12-bio-nat-u3-s1', name: 'Mendelian Genetics' },
                { id: 'g12-bio-nat-u3-s2', name: 'Molecular Genetics' },
                { id: 'g12-bio-nat-u3-s3', name: 'Mutations and Genetic Engineering' }
              ]
            },
            {
              id: 'g12-bio-nat-u4',
              name: 'Evolution',
              subUnits: [
                { id: 'g12-bio-nat-u4-s1', name: 'Evidence of Evolution' },
                { id: 'g12-bio-nat-u4-s2', name: 'Theories of Evolution' },
                { id: 'g12-bio-nat-u4-s3', name: 'Human Evolution' }
              ]
            }
          ]
        },
        {
          id: 'g12-math-soc',
          name: 'Mathematics',
          stream: 'Social',
          units: [
            {
              id: 'g12-math-soc-u1',
              name: 'Sequences and Series',
              subUnits: [
                { id: 'g12-math-soc-u1-s1', name: 'Sequences' },
                { id: 'g12-math-soc-u1-s2', name: 'Arithmetic and Geometric Sequences' },
                { id: 'g12-math-soc-u1-s3', name: 'The Sigma Notation and Partial Sums' },
                { id: 'g12-math-soc-u1-s4', name: 'Infinite Series' },
                { id: 'g12-math-soc-u1-s5', name: 'Applications of Progressions' }
              ]
            },
            {
              id: 'g12-math-soc-u2',
              name: 'Introduction to Limits and Continuity',
              subUnits: [
                { id: 'g12-math-soc-u2-s1', name: 'Limits of Sequences of Numbers' },
                { id: 'g12-math-soc-u2-s2', name: 'Limits of Functions' },
                { id: 'g12-math-soc-u2-s3', name: 'Continuity of a Function' }
              ]
            },
            {
              id: 'g12-math-soc-u3',
              name: 'Introduction to Differential Calculus',
              subUnits: [
                { id: 'g12-math-soc-u3-s1', name: 'Introduction to Derivatives' },
                { id: 'g12-math-soc-u3-s2', name: 'Derivatives of Some Functions' },
                { id: 'g12-math-soc-u3-s3', name: 'Derivatives of Combinations and Compositions' }
              ]
            },
            {
              id: 'g12-math-soc-u4',
              name: 'Applications of Differential Calculus',
              subUnits: [
                { id: 'g12-math-soc-u4-s1', name: 'Extreme Values of Functions' },
                { id: 'g12-math-soc-u4-s2', name: 'Curve Sketching' }
              ]
            },
            {
              id: 'g12-math-soc-u5',
              name: 'Introduction to Integral Calculus',
              subUnits: [
                { id: 'g12-math-soc-u5-s1', name: 'Integration as Reverse Process of Differentiation' },
                { id: 'g12-math-soc-u5-s2', name: 'Definite Integrals and Area' }
              ]
            },
            {
              id: 'g12-math-soc-u8',
              name: 'Further on Statistics',
              subUnits: [
                { id: 'g12-math-soc-u8-s1', name: 'Sampling Techniques' },
                { id: 'g12-math-soc-u8-s2', name: 'Representation and Interpretation of Data' },
                { id: 'g12-math-soc-u8-s3', name: 'Measures of Central Tendency and Variability' },
                { id: 'g12-math-soc-u8-s4', name: 'Use of Cumulative Frequency Curves' }
              ]
            },
            {
              id: 'g12-math-soc-u9',
              name: 'Application for Business and Consumers',
              subUnits: [
                { id: 'g12-math-soc-u9-s1', name: 'Simple and Compound Interest' },
                { id: 'g12-math-soc-u9-s2', name: 'Depreciation and Taxation' },
                { id: 'g12-math-soc-u9-s3', name: 'Investment Portfolios' }
              ]
            }
          ]
        },
        {
          id: 'g12-geo-soc',
          name: 'Geography',
          stream: 'Social',
          units: [
            {
              id: 'g12-geo-soc-u1',
              name: 'Map Reading and Interpretation',
              subUnits: [
                { id: 'g12-geo-soc-u1-s1', name: 'Topographical Maps Interpretation' },
                { id: 'g12-geo-soc-u1-s2', name: 'Geospatial Technologies' }
              ]
            },
            {
              id: 'g12-geo-soc-u2',
              name: 'Physical Geography of Africa and Ethiopia',
              subUnits: [
                { id: 'g12-geo-soc-u2-s1', name: 'Geological Structures and Landforms' },
                { id: 'g12-geo-soc-u2-s2', name: 'Climate and Drainage Systems' }
              ]
            }
          ]
        },
        {
          id: 'g12-eco-soc',
          name: 'Economics',
          stream: 'Social',
          units: [
            {
              id: 'g12-eco-soc-u1',
              name: 'Introduction to Macroeconomics',
              subUnits: [
                { id: 'g12-eco-soc-u1-s1', name: 'Scope of Macroeconomics' },
                { id: 'g12-eco-soc-u1-s2', name: 'The Circular Flow of Income' }
              ]
            },
            {
              id: 'g12-eco-soc-u2',
              name: 'National Income Accounting',
              subUnits: [
                { id: 'g12-eco-soc-u2-s1', name: 'GDP and GNP Metrics' },
                { id: 'g12-eco-soc-u2-s2', name: 'Nominal vs Real GDP' }
              ]
            }
          ]
        }
];

fs.writeFileSync("g12.json", JSON.stringify(data));
