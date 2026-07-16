// Auto-generated from content-source/g9.json .. g12.json
// To edit curriculum content, edit the JSON files in /content-source and regenerate this file.

export interface SubUnit {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
  subUnits: SubUnit[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  grade: string;
  stream?: "Natural" | "Social";
  units: Unit[];
}

export const CURRICULUM_DATA: Subject[] = [
  {
    "id": "g9-math",
    "name": "Mathematics",
    "icon": "Calculator",
    "grade": "9",
    "units": [
      {
        "id": "g9-math-u1",
        "name": "Further on Sets",
        "subUnits": [
          {
            "id": "g9-math-u1-s1",
            "name": "Ideas of Sets"
          },
          {
            "id": "g9-math-u1-s2",
            "name": "Operations on Sets"
          },
          {
            "id": "g9-math-u1-s3",
            "name": "Venn Diagrams"
          },
          {
            "id": "g9-math-u1-s4",
            "name": "Applications of Sets"
          }
        ]
      },
      {
        "id": "g9-math-u2",
        "name": "The Number System",
        "subUnits": [
          {
            "id": "g9-math-u2-s1",
            "name": "Revision on Rational Numbers"
          },
          {
            "id": "g9-math-u2-s2",
            "name": "Irrational Numbers"
          },
          {
            "id": "g9-math-u2-s3",
            "name": "The Real Number System"
          },
          {
            "id": "g9-math-u2-s4",
            "name": "Significant Figures and Rounding"
          }
        ]
      },
      {
        "id": "g9-math-u3",
        "name": "Solving Equations",
        "subUnits": [
          {
            "id": "g9-math-u3-s1",
            "name": "Equations Involving Exponents and Radicals"
          },
          {
            "id": "g9-math-u3-s2",
            "name": "Systems of Linear Equations"
          },
          {
            "id": "g9-math-u3-s3",
            "name": "Equations Involving Absolute Value"
          },
          {
            "id": "g9-math-u3-s4",
            "name": "Quadratic Equations"
          }
        ]
      },
      {
        "id": "g9-math-u4",
        "name": "Solving Inequalities",
        "subUnits": [
          {
            "id": "g9-math-u4-s1",
            "name": "Linear Inequalities"
          },
          {
            "id": "g9-math-u4-s2",
            "name": "Systems of Linear Inequalities"
          },
          {
            "id": "g9-math-u4-s3",
            "name": "Inequalities Involving Absolute Value"
          },
          {
            "id": "g9-math-u4-s4",
            "name": "Quadratic Inequalities"
          }
        ]
      },
      {
        "id": "g9-math-u5",
        "name": "Introduction to Trigonometry",
        "subUnits": [
          {
            "id": "g9-math-u5-s1",
            "name": "Basic Trigonometric Ratios"
          },
          {
            "id": "g9-math-u5-s2",
            "name": "Trigonometric Values of Special Angles"
          },
          {
            "id": "g9-math-u5-s3",
            "name": "Solving Right-Angled Triangles"
          },
          {
            "id": "g9-math-u5-s4",
            "name": "Applications of Trigonometry"
          }
        ]
      },
      {
        "id": "g9-math-u6",
        "name": "Regular Polygons",
        "subUnits": [
          {
            "id": "g9-math-u6-s1",
            "name": "Properties of Regular Polygons"
          },
          {
            "id": "g9-math-u6-s2",
            "name": "Interior and Exterior Angles"
          },
          {
            "id": "g9-math-u6-s3",
            "name": "Perimeter and Area of Regular Polygons"
          }
        ]
      },
      {
        "id": "g9-math-u7",
        "name": "Congruency and Similarity",
        "subUnits": [
          {
            "id": "g9-math-u7-s1",
            "name": "Congruency of Triangles"
          },
          {
            "id": "g9-math-u7-s2",
            "name": "Similarity of Triangles"
          },
          {
            "id": "g9-math-u7-s3",
            "name": "Theorems on Similar Figures"
          },
          {
            "id": "g9-math-u7-s4",
            "name": "Applications of Similarity"
          }
        ]
      },
      {
        "id": "g9-math-u8",
        "name": "Vectors in Two Dimensions",
        "subUnits": [
          {
            "id": "g9-math-u8-s1",
            "name": "Scalar and Vector Quantities"
          },
          {
            "id": "g9-math-u8-s2",
            "name": "Representation of Vectors"
          },
          {
            "id": "g9-math-u8-s3",
            "name": "Operations on Vectors"
          },
          {
            "id": "g9-math-u8-s4",
            "name": "Position Vectors"
          }
        ]
      },
      {
        "id": "g9-math-u9",
        "name": "Statistics and Probability",
        "subUnits": [
          {
            "id": "g9-math-u9-s1",
            "name": "Collection and Presentation of Data"
          },
          {
            "id": "g9-math-u9-s2",
            "name": "Measures of Central Tendency and Dispersion"
          },
          {
            "id": "g9-math-u9-s3",
            "name": "Basic Probability Concepts"
          },
          {
            "id": "g9-math-u9-s4",
            "name": "Probability of Events"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-phy",
    "name": "Physics",
    "icon": "Zap",
    "grade": "9",
    "units": [
      {
        "id": "g9-phy-u1",
        "name": "Introduction to Physics",
        "subUnits": [
          {
            "id": "g9-phy-u1-s1",
            "name": "Definition and Nature of Physics"
          },
          {
            "id": "g9-phy-u1-s2",
            "name": "Branches of Physics"
          },
          {
            "id": "g9-phy-u1-s3",
            "name": "Relationship with Other Sciences"
          }
        ]
      },
      {
        "id": "g9-phy-u2",
        "name": "Physical Quantities and Measurement",
        "subUnits": [
          {
            "id": "g9-phy-u2-s1",
            "name": "Fundamental and Derived Quantities"
          },
          {
            "id": "g9-phy-u2-s2",
            "name": "SI Units and Unit Conversion"
          },
          {
            "id": "g9-phy-u2-s3",
            "name": "Measurement and Uncertainty"
          }
        ]
      },
      {
        "id": "g9-phy-u3",
        "name": "Motion, Force, Work, Energy and Power",
        "subUnits": [
          {
            "id": "g9-phy-u3-s1",
            "name": "Motion in a Straight Line"
          },
          {
            "id": "g9-phy-u3-s2",
            "name": "Newton's Laws of Motion"
          },
          {
            "id": "g9-phy-u3-s3",
            "name": "Work, Energy and Power"
          }
        ]
      },
      {
        "id": "g9-phy-u4",
        "name": "Simple Machines",
        "subUnits": [
          {
            "id": "g9-phy-u4-s1",
            "name": "Purpose and Types of Simple Machines"
          },
          {
            "id": "g9-phy-u4-s2",
            "name": "Mechanical Advantage and Efficiency"
          },
          {
            "id": "g9-phy-u4-s3",
            "name": "Levers, Inclined Planes and Pulleys"
          }
        ]
      },
      {
        "id": "g9-phy-u5",
        "name": "Fluid Statics",
        "subUnits": [
          {
            "id": "g9-phy-u5-s1",
            "name": "Air Pressure"
          },
          {
            "id": "g9-phy-u5-s2",
            "name": "Fluid Pressure"
          },
          {
            "id": "g9-phy-u5-s3",
            "name": "Applications of Fluid Statics"
          }
        ]
      },
      {
        "id": "g9-phy-u6",
        "name": "Heat and Temperature",
        "subUnits": [
          {
            "id": "g9-phy-u6-s1",
            "name": "Temperature and Heat Energy"
          },
          {
            "id": "g9-phy-u6-s2",
            "name": "Thermal Expansion"
          },
          {
            "id": "g9-phy-u6-s3",
            "name": "Specific Heat Capacity and Change of State"
          }
        ]
      },
      {
        "id": "g9-phy-u7",
        "name": "Wave Motion and Sound",
        "subUnits": [
          {
            "id": "g9-phy-u7-s1",
            "name": "Wave Propagation"
          },
          {
            "id": "g9-phy-u7-s2",
            "name": "Properties of Mechanical Waves"
          },
          {
            "id": "g9-phy-u7-s3",
            "name": "Sound Waves"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-che",
    "name": "Chemistry",
    "icon": "FlaskConical",
    "grade": "9",
    "units": [
      {
        "id": "g9-che-u1",
        "name": "Chemistry and Its Importance",
        "subUnits": [
          {
            "id": "g9-che-u1-s1",
            "name": "Definition and Scope of Chemistry"
          },
          {
            "id": "g9-che-u1-s2",
            "name": "Relationship Between Chemistry and Other Natural Sciences"
          },
          {
            "id": "g9-che-u1-s3",
            "name": "Role of Chemistry in Production and Society"
          },
          {
            "id": "g9-che-u1-s4",
            "name": "Common Chemical Industries in Ethiopia"
          }
        ]
      },
      {
        "id": "g9-che-u2",
        "name": "Measurements and Scientific Methods",
        "subUnits": [
          {
            "id": "g9-che-u2-s1",
            "name": "Measurements and Units in Chemistry"
          },
          {
            "id": "g9-che-u2-s2",
            "name": "Chemistry as Experimental Science"
          }
        ]
      },
      {
        "id": "g9-che-u3",
        "name": "Structure of the Atom",
        "subUnits": [
          {
            "id": "g9-che-u3-s1",
            "name": "Historical Development of Atomic Theories"
          },
          {
            "id": "g9-che-u3-s2",
            "name": "Fundamental Laws of Chemical Reactions"
          },
          {
            "id": "g9-che-u3-s3",
            "name": "Atomic Theory"
          },
          {
            "id": "g9-che-u3-s4",
            "name": "Discovery of Subatomic Particles and the Nucleus"
          },
          {
            "id": "g9-che-u3-s5",
            "name": "Composition of an Atom and Isotopes"
          }
        ]
      },
      {
        "id": "g9-che-u4",
        "name": "Periodic Classification of Elements",
        "subUnits": [
          {
            "id": "g9-che-u4-s1",
            "name": "Historical Development of Periodic Classification"
          },
          {
            "id": "g9-che-u4-s2",
            "name": "Mendeleev's Classification"
          },
          {
            "id": "g9-che-u4-s3",
            "name": "The Modern Periodic Table"
          },
          {
            "id": "g9-che-u4-s4",
            "name": "Periodic Trends and Properties"
          }
        ]
      },
      {
        "id": "g9-che-u5",
        "name": "Chemical Bonding",
        "subUnits": [
          {
            "id": "g9-che-u5-s1",
            "name": "Ionic Bonding"
          },
          {
            "id": "g9-che-u5-s2",
            "name": "Covalent Bonding"
          },
          {
            "id": "g9-che-u5-s3",
            "name": "Metallic Bonding"
          },
          {
            "id": "g9-che-u5-s4",
            "name": "Bond Polarity and Molecular Shape"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-bio",
    "name": "Biology",
    "icon": "Dna",
    "grade": "9",
    "units": [
      {
        "id": "g9-bio-u1",
        "name": "Introduction to Biology",
        "subUnits": [
          {
            "id": "g9-bio-u1-s1",
            "name": "Definition, Scope and Branches of Biology"
          },
          {
            "id": "g9-bio-u1-s2",
            "name": "Importance of Biology"
          },
          {
            "id": "g9-bio-u1-s3",
            "name": "Scientific Methods in Biology"
          }
        ]
      },
      {
        "id": "g9-bio-u2",
        "name": "Characteristics and Classification of Organisms",
        "subUnits": [
          {
            "id": "g9-bio-u2-s1",
            "name": "Characteristics of Living Things"
          },
          {
            "id": "g9-bio-u2-s2",
            "name": "Classification Systems"
          },
          {
            "id": "g9-bio-u2-s3",
            "name": "Kingdom Classification"
          },
          {
            "id": "g9-bio-u2-s4",
            "name": "Binomial Nomenclature"
          }
        ]
      },
      {
        "id": "g9-bio-u3",
        "name": "Cells",
        "subUnits": [
          {
            "id": "g9-bio-u3-s1",
            "name": "Cell Theory"
          },
          {
            "id": "g9-bio-u3-s2",
            "name": "Prokaryotic and Eukaryotic Cells"
          },
          {
            "id": "g9-bio-u3-s3",
            "name": "Cell Organelles and Functions"
          },
          {
            "id": "g9-bio-u3-s4",
            "name": "Cell Division"
          }
        ]
      },
      {
        "id": "g9-bio-u4",
        "name": "Reproduction",
        "subUnits": [
          {
            "id": "g9-bio-u4-s1",
            "name": "Asexual Reproduction"
          },
          {
            "id": "g9-bio-u4-s2",
            "name": "Sexual Reproduction"
          },
          {
            "id": "g9-bio-u4-s3",
            "name": "Reproduction in Plants"
          },
          {
            "id": "g9-bio-u4-s4",
            "name": "Reproduction in Animals"
          }
        ]
      },
      {
        "id": "g9-bio-u5",
        "name": "Human Health, Nutrition, and Disease",
        "subUnits": [
          {
            "id": "g9-bio-u5-s1",
            "name": "Nutrition and Balanced Diet"
          },
          {
            "id": "g9-bio-u5-s2",
            "name": "Human Health and Hygiene"
          },
          {
            "id": "g9-bio-u5-s3",
            "name": "Communicable and Non-Communicable Diseases"
          },
          {
            "id": "g9-bio-u5-s4",
            "name": "HIV/AIDS and Other STIs"
          }
        ]
      },
      {
        "id": "g9-bio-u6",
        "name": "Ecology",
        "subUnits": [
          {
            "id": "g9-bio-u6-s1",
            "name": "Ecosystem Concepts"
          },
          {
            "id": "g9-bio-u6-s2",
            "name": "Energy Flow and Food Chains"
          },
          {
            "id": "g9-bio-u6-s3",
            "name": "Biogeochemical Cycles"
          },
          {
            "id": "g9-bio-u6-s4",
            "name": "Human Impact on the Environment"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-eng",
    "name": "English",
    "icon": "BookA",
    "grade": "9",
    "units": [
      {
        "id": "g9-eng-u1",
        "name": "Living in Urban Areas",
        "subUnits": [
          {
            "id": "g9-eng-u1-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u1-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u1-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u1-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u2",
        "name": "Study Skills",
        "subUnits": [
          {
            "id": "g9-eng-u2-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u2-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u2-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u2-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u3",
        "name": "Traffic Accident",
        "subUnits": [
          {
            "id": "g9-eng-u3-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u3-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u3-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u3-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u4",
        "name": "National Parks",
        "subUnits": [
          {
            "id": "g9-eng-u4-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u4-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u4-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u4-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u5",
        "name": "Horticulture",
        "subUnits": [
          {
            "id": "g9-eng-u5-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u5-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u5-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u5-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u6",
        "name": "Poverty in Ethiopia",
        "subUnits": [
          {
            "id": "g9-eng-u6-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u6-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u6-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u6-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u7",
        "name": "Community Services",
        "subUnits": [
          {
            "id": "g9-eng-u7-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u7-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u7-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u7-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u8",
        "name": "Communicable Diseases",
        "subUnits": [
          {
            "id": "g9-eng-u8-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u8-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u8-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u8-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u9",
        "name": "Fairness and Equity",
        "subUnits": [
          {
            "id": "g9-eng-u9-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u9-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u9-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u9-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-eng-u10",
        "name": "The Internet",
        "subUnits": [
          {
            "id": "g9-eng-u10-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-eng-u10-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-eng-u10-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g9-eng-u10-s4",
            "name": "Writing"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-his",
    "name": "History",
    "icon": "Landmark",
    "grade": "9",
    "units": [
      {
        "id": "g9-his-u1",
        "name": "History, Historiography and Human Evolution",
        "subUnits": [
          {
            "id": "g9-his-u1-s1",
            "name": "Meaning and Importance of History"
          },
          {
            "id": "g9-his-u1-s2",
            "name": "Sources and Methods of History"
          },
          {
            "id": "g9-his-u1-s3",
            "name": "Origins and Evolution of Humankind"
          }
        ]
      },
      {
        "id": "g9-his-u2",
        "name": "Ancient Civilizations of the World",
        "subUnits": [
          {
            "id": "g9-his-u2-s1",
            "name": "Civilizations of the Near East"
          },
          {
            "id": "g9-his-u2-s2",
            "name": "Civilizations of Asia"
          },
          {
            "id": "g9-his-u2-s3",
            "name": "Civilizations of the Mediterranean"
          }
        ]
      },
      {
        "id": "g9-his-u3",
        "name": "Peoples and States of Ancient Ethiopia and the Horn",
        "subUnits": [
          {
            "id": "g9-his-u3-s1",
            "name": "Early Peoples and Settlements"
          },
          {
            "id": "g9-his-u3-s2",
            "name": "Ancient States of the Region"
          },
          {
            "id": "g9-his-u3-s3",
            "name": "Cultural and Economic Foundations"
          }
        ]
      },
      {
        "id": "g9-his-u4",
        "name": "Peoples and States of Africa",
        "subUnits": [
          {
            "id": "g9-his-u4-s1",
            "name": "Early African Societies"
          },
          {
            "id": "g9-his-u4-s2",
            "name": "Ancient and Medieval African States"
          },
          {
            "id": "g9-his-u4-s3",
            "name": "Trade and Exchange in Africa"
          }
        ]
      },
      {
        "id": "g9-his-u5",
        "name": "Africa and the Outside World",
        "subUnits": [
          {
            "id": "g9-his-u5-s1",
            "name": "Early Contacts with the Outside World"
          },
          {
            "id": "g9-his-u5-s2",
            "name": "Trade Relations"
          },
          {
            "id": "g9-his-u5-s3",
            "name": "Cultural Exchanges"
          }
        ]
      },
      {
        "id": "g9-his-u6",
        "name": "The Middle Ages",
        "subUnits": [
          {
            "id": "g9-his-u6-s1",
            "name": "Political Developments in the Middle Ages"
          },
          {
            "id": "g9-his-u6-s2",
            "name": "Society and Economy"
          },
          {
            "id": "g9-his-u6-s3",
            "name": "Religion and Culture"
          }
        ]
      },
      {
        "id": "g9-his-u7",
        "name": "States, Principalities and Population Movements in Ethiopia",
        "subUnits": [
          {
            "id": "g9-his-u7-s1",
            "name": "Political Fragmentation"
          },
          {
            "id": "g9-his-u7-s2",
            "name": "Population Movements"
          },
          {
            "id": "g9-his-u7-s3",
            "name": "Regional States and Principalities"
          }
        ]
      },
      {
        "id": "g9-his-u8",
        "name": "The Early Modern World",
        "subUnits": [
          {
            "id": "g9-his-u8-s1",
            "name": "Exploration and Globalization"
          },
          {
            "id": "g9-his-u8-s2",
            "name": "Renaissance and Reformation"
          },
          {
            "id": "g9-his-u8-s3",
            "name": "Rise of Early Modern States"
          }
        ]
      },
      {
        "id": "g9-his-u9",
        "name": "The Age of Revolutions",
        "subUnits": [
          {
            "id": "g9-his-u9-s1",
            "name": "The Industrial Revolution"
          },
          {
            "id": "g9-his-u9-s2",
            "name": "Political Revolutions"
          },
          {
            "id": "g9-his-u9-s3",
            "name": "Impacts of the Age of Revolutions"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-geo",
    "name": "Geography",
    "icon": "Globe",
    "grade": "9",
    "units": [
      {
        "id": "g9-geo-u1",
        "name": "Introduction to Geography and Location of Ethiopia",
        "subUnits": [
          {
            "id": "g9-geo-u1-s1",
            "name": "Meaning, Scope and Branches of Geography"
          },
          {
            "id": "g9-geo-u1-s2",
            "name": "Location, Size and Shape of Ethiopia"
          },
          {
            "id": "g9-geo-u1-s3",
            "name": "Effects of Location and Size on Ethiopia"
          }
        ]
      },
      {
        "id": "g9-geo-u2",
        "name": "Geological History and Landforms of Ethiopia",
        "subUnits": [
          {
            "id": "g9-geo-u2-s1",
            "name": "Geological History of Ethiopia"
          },
          {
            "id": "g9-geo-u2-s2",
            "name": "Major Landform Regions"
          },
          {
            "id": "g9-geo-u2-s3",
            "name": "Factors Shaping Ethiopian Landforms"
          }
        ]
      },
      {
        "id": "g9-geo-u3",
        "name": "Drainage Systems of Ethiopia",
        "subUnits": [
          {
            "id": "g9-geo-u3-s1",
            "name": "Major River Basins of Ethiopia"
          },
          {
            "id": "g9-geo-u3-s2",
            "name": "Lakes of Ethiopia"
          },
          {
            "id": "g9-geo-u3-s3",
            "name": "Importance of Drainage Systems"
          }
        ]
      },
      {
        "id": "g9-geo-u4",
        "name": "Climate of Ethiopia",
        "subUnits": [
          {
            "id": "g9-geo-u4-s1",
            "name": "Factors Affecting Ethiopian Climate"
          },
          {
            "id": "g9-geo-u4-s2",
            "name": "Climate Classification of Ethiopia"
          },
          {
            "id": "g9-geo-u4-s3",
            "name": "Seasons and Rainfall Patterns"
          }
        ]
      },
      {
        "id": "g9-geo-u5",
        "name": "Natural Vegetation and Wildlife of Ethiopia",
        "subUnits": [
          {
            "id": "g9-geo-u5-s1",
            "name": "Vegetation Zones of Ethiopia"
          },
          {
            "id": "g9-geo-u5-s2",
            "name": "Wildlife and Biodiversity"
          },
          {
            "id": "g9-geo-u5-s3",
            "name": "Conservation of Natural Resources"
          }
        ]
      },
      {
        "id": "g9-geo-u6",
        "name": "Soil and Mineral Resources of Ethiopia",
        "subUnits": [
          {
            "id": "g9-geo-u6-s1",
            "name": "Major Soil Types of Ethiopia"
          },
          {
            "id": "g9-geo-u6-s2",
            "name": "Mineral Resources and Their Distribution"
          },
          {
            "id": "g9-geo-u6-s3",
            "name": "Resource Management Challenges"
          }
        ]
      },
      {
        "id": "g9-geo-u7",
        "name": "Population of Ethiopia",
        "subUnits": [
          {
            "id": "g9-geo-u7-s1",
            "name": "Population Size, Growth and Distribution"
          },
          {
            "id": "g9-geo-u7-s2",
            "name": "Population Composition"
          },
          {
            "id": "g9-geo-u7-s3",
            "name": "Population Policy in Ethiopia"
          }
        ]
      },
      {
        "id": "g9-geo-u8",
        "name": "Economic Activities of Ethiopia",
        "subUnits": [
          {
            "id": "g9-geo-u8-s1",
            "name": "Agriculture in Ethiopia"
          },
          {
            "id": "g9-geo-u8-s2",
            "name": "Industry and Manufacturing"
          },
          {
            "id": "g9-geo-u8-s3",
            "name": "Trade, Tourism and Services"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-cve",
    "name": "Citizenship Education",
    "icon": "Scale",
    "grade": "9",
    "units": [
      {
        "id": "g9-cve-u1",
        "name": "Ethical Values",
        "subUnits": [
          {
            "id": "g9-cve-u1-s1",
            "name": "Meaning and Importance of Ethics"
          },
          {
            "id": "g9-cve-u1-s2",
            "name": "Major Ethical Values"
          },
          {
            "id": "g9-cve-u1-s3",
            "name": "Ethical Values in the Ethiopian Context"
          }
        ]
      },
      {
        "id": "g9-cve-u2",
        "name": "Culture of Using Digital Technology",
        "subUnits": [
          {
            "id": "g9-cve-u2-s1",
            "name": "Digital Citizenship"
          },
          {
            "id": "g9-cve-u2-s2",
            "name": "Benefits and Risks of Technology"
          },
          {
            "id": "g9-cve-u2-s3",
            "name": "Responsible Online Behavior"
          }
        ]
      },
      {
        "id": "g9-cve-u3",
        "name": "Constitution and Constitutionalism",
        "subUnits": [
          {
            "id": "g9-cve-u3-s1",
            "name": "Meaning of Constitution"
          },
          {
            "id": "g9-cve-u3-s2",
            "name": "Principles of Constitutionalism"
          },
          {
            "id": "g9-cve-u3-s3",
            "name": "The Ethiopian Constitution"
          }
        ]
      },
      {
        "id": "g9-cve-u4",
        "name": "Indigenous Knowledge",
        "subUnits": [
          {
            "id": "g9-cve-u4-s1",
            "name": "Meaning and Sources of Indigenous Knowledge"
          },
          {
            "id": "g9-cve-u4-s2",
            "name": "Indigenous Knowledge Systems in Ethiopia"
          },
          {
            "id": "g9-cve-u4-s3",
            "name": "Preserving Indigenous Knowledge"
          }
        ]
      },
      {
        "id": "g9-cve-u5",
        "name": "Multiculturalism",
        "subUnits": [
          {
            "id": "g9-cve-u5-s1",
            "name": "Meaning of Multiculturalism"
          },
          {
            "id": "g9-cve-u5-s2",
            "name": "Benefits of Cultural Diversity"
          },
          {
            "id": "g9-cve-u5-s3",
            "name": "Challenges of Multiculturalism"
          }
        ]
      },
      {
        "id": "g9-cve-u6",
        "name": "National Unity through Diversity",
        "subUnits": [
          {
            "id": "g9-cve-u6-s1",
            "name": "Unity in Diversity"
          },
          {
            "id": "g9-cve-u6-s2",
            "name": "Factors that Promote National Unity"
          },
          {
            "id": "g9-cve-u6-s3",
            "name": "Threats to National Unity"
          }
        ]
      },
      {
        "id": "g9-cve-u7",
        "name": "Problem Solving Skills",
        "subUnits": [
          {
            "id": "g9-cve-u7-s1",
            "name": "Steps in Problem Solving"
          },
          {
            "id": "g9-cve-u7-s2",
            "name": "Critical and Creative Thinking"
          },
          {
            "id": "g9-cve-u7-s3",
            "name": "Decision-Making Skills"
          }
        ]
      },
      {
        "id": "g9-cve-u8",
        "name": "Ethiopia's Foreign Relations in East Africa",
        "subUnits": [
          {
            "id": "g9-cve-u8-s1",
            "name": "Ethiopia's Foreign Policy"
          },
          {
            "id": "g9-cve-u8-s2",
            "name": "Regional Cooperation in East Africa"
          },
          {
            "id": "g9-cve-u8-s3",
            "name": "Ethiopia's Role in Regional Organizations"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-eco",
    "name": "Economics",
    "icon": "TrendingUp",
    "grade": "9",
    "units": [
      {
        "id": "g9-eco-u1",
        "name": "Introduction to Economics",
        "subUnits": [
          {
            "id": "g9-eco-u1-s1",
            "name": "Definition and Branches of Economics"
          },
          {
            "id": "g9-eco-u1-s2",
            "name": "Methods of Economic Analysis"
          },
          {
            "id": "g9-eco-u1-s3",
            "name": "Basic Economic Concepts"
          }
        ]
      },
      {
        "id": "g9-eco-u2",
        "name": "Basic Economic Problems and Systems",
        "subUnits": [
          {
            "id": "g9-eco-u2-s1",
            "name": "Scarcity, Choice and Opportunity Cost"
          },
          {
            "id": "g9-eco-u2-s2",
            "name": "Central Economic Problems"
          },
          {
            "id": "g9-eco-u2-s3",
            "name": "Types of Economic Systems"
          }
        ]
      },
      {
        "id": "g9-eco-u3",
        "name": "Economic Resources and Markets",
        "subUnits": [
          {
            "id": "g9-eco-u3-s1",
            "name": "Classification of Economic Resources"
          },
          {
            "id": "g9-eco-u3-s2",
            "name": "Factor Payments"
          },
          {
            "id": "g9-eco-u3-s3",
            "name": "Circular Flow of Economic Activity"
          }
        ]
      },
      {
        "id": "g9-eco-u4",
        "name": "Demand, Supply and Market Equilibrium",
        "subUnits": [
          {
            "id": "g9-eco-u4-s1",
            "name": "The Law of Demand and Supply"
          },
          {
            "id": "g9-eco-u4-s2",
            "name": "Factors Affecting Demand and Supply"
          },
          {
            "id": "g9-eco-u4-s3",
            "name": "Market Equilibrium"
          }
        ]
      },
      {
        "id": "g9-eco-u5",
        "name": "Theory of Production and Cost",
        "subUnits": [
          {
            "id": "g9-eco-u5-s1",
            "name": "Production, Inputs and Outputs"
          },
          {
            "id": "g9-eco-u5-s2",
            "name": "Short-Run and Long-Run Production"
          },
          {
            "id": "g9-eco-u5-s3",
            "name": "Types of Production Costs"
          }
        ]
      },
      {
        "id": "g9-eco-u6",
        "name": "Money and Banking",
        "subUnits": [
          {
            "id": "g9-eco-u6-s1",
            "name": "Evolution and Functions of Money"
          },
          {
            "id": "g9-eco-u6-s2",
            "name": "Banking System in Ethiopia"
          },
          {
            "id": "g9-eco-u6-s3",
            "name": "Role of the Central Bank"
          }
        ]
      },
      {
        "id": "g9-eco-u7",
        "name": "Macroeconomic Concepts and National Income",
        "subUnits": [
          {
            "id": "g9-eco-u7-s1",
            "name": "National Economic Goals"
          },
          {
            "id": "g9-eco-u7-s2",
            "name": "Measuring GDP and National Income"
          },
          {
            "id": "g9-eco-u7-s3",
            "name": "Inflation and Unemployment"
          }
        ]
      },
      {
        "id": "g9-eco-u8",
        "name": "Entrepreneurship and Business Opportunities",
        "subUnits": [
          {
            "id": "g9-eco-u8-s1",
            "name": "Meaning of Entrepreneurship"
          },
          {
            "id": "g9-eco-u8-s2",
            "name": "Identifying Business Opportunities"
          },
          {
            "id": "g9-eco-u8-s3",
            "name": "Business Planning Basics"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-amh",
    "name": "Amharic",
    "icon": "MessageSquare",
    "grade": "9",
    "units": [
      {
        "id": "g9-amh-u1",
        "name": "Unit 1 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u1-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u1-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u1-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u1-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-amh-u2",
        "name": "Unit 2 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u2-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u2-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u2-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u2-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-amh-u3",
        "name": "Unit 3 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u3-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u3-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u3-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u3-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-amh-u4",
        "name": "Unit 4 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u4-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u4-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u4-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u4-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-amh-u5",
        "name": "Unit 5 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u5-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u5-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u5-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u5-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-amh-u6",
        "name": "Unit 6 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u6-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u6-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u6-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u6-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-amh-u7",
        "name": "Unit 7 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u7-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u7-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u7-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u7-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-amh-u8",
        "name": "Unit 8 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u8-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u8-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u8-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u8-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g9-amh-u9",
        "name": "Unit 9 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g9-amh-u9-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g9-amh-u9-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g9-amh-u9-s3",
            "name": "Grammar and Vocabulary"
          },
          {
            "id": "g9-amh-u9-s4",
            "name": "Writing"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-ict",
    "name": "Information Technology",
    "icon": "MonitorSmartphone",
    "grade": "9",
    "units": [
      {
        "id": "g9-ict-u1",
        "name": "Organization of Files",
        "subUnits": [
          {
            "id": "g9-ict-u1-s1",
            "name": "File and Folder Management"
          },
          {
            "id": "g9-ict-u1-s2",
            "name": "File Naming Conventions"
          },
          {
            "id": "g9-ict-u1-s3",
            "name": "Backup and Storage"
          },
          {
            "id": "g9-ict-u1-s4",
            "name": "File Compression"
          }
        ]
      },
      {
        "id": "g9-ict-u2",
        "name": "Computer Network",
        "subUnits": [
          {
            "id": "g9-ict-u2-s1",
            "name": "Network Basics and Types"
          },
          {
            "id": "g9-ict-u2-s2",
            "name": "Network Devices and Topologies"
          },
          {
            "id": "g9-ict-u2-s3",
            "name": "Internet and Connectivity"
          },
          {
            "id": "g9-ict-u2-s4",
            "name": "Network Security Basics"
          }
        ]
      },
      {
        "id": "g9-ict-u3",
        "name": "Application Software",
        "subUnits": [
          {
            "id": "g9-ict-u3-s1",
            "name": "Word Processing"
          },
          {
            "id": "g9-ict-u3-s2",
            "name": "Spreadsheet Applications"
          },
          {
            "id": "g9-ict-u3-s3",
            "name": "Presentation Software"
          },
          {
            "id": "g9-ict-u3-s4",
            "name": "Database Basics"
          }
        ]
      },
      {
        "id": "g9-ict-u4",
        "name": "Image Processing and Multimedia",
        "subUnits": [
          {
            "id": "g9-ict-u4-s1",
            "name": "Digital Image Basics"
          },
          {
            "id": "g9-ict-u4-s2",
            "name": "Image Editing Tools"
          },
          {
            "id": "g9-ict-u4-s3",
            "name": "Multimedia Components"
          },
          {
            "id": "g9-ict-u4-s4",
            "name": "Multimedia Applications"
          }
        ]
      },
      {
        "id": "g9-ict-u5",
        "name": "Information and Computer Security",
        "subUnits": [
          {
            "id": "g9-ict-u5-s1",
            "name": "Computer Threats and Viruses"
          },
          {
            "id": "g9-ict-u5-s2",
            "name": "Data Protection Methods"
          },
          {
            "id": "g9-ict-u5-s3",
            "name": "Ethical Use of ICT"
          },
          {
            "id": "g9-ict-u5-s4",
            "name": "Cyber Safety Practices"
          }
        ]
      },
      {
        "id": "g9-ict-u6",
        "name": "Fundamentals of Programming",
        "subUnits": [
          {
            "id": "g9-ict-u6-s1",
            "name": "Introduction to Programming Concepts"
          },
          {
            "id": "g9-ict-u6-s2",
            "name": "Algorithms and Flowcharts"
          },
          {
            "id": "g9-ict-u6-s3",
            "name": "Basic Programming Constructs"
          },
          {
            "id": "g9-ict-u6-s4",
            "name": "Simple Program Writing"
          }
        ]
      }
    ]
  },
  {
    "id": "g9-hpe",
    "name": "Health and Physical Education",
    "icon": "Activity",
    "grade": "9",
    "units": [
      {
        "id": "g9-hpe-u1",
        "name": "Sport and Society",
        "subUnits": [
          {
            "id": "g9-hpe-u1-s1",
            "name": "Definition and Importance of Sport"
          },
          {
            "id": "g9-hpe-u1-s2",
            "name": "Sport and National Development"
          },
          {
            "id": "g9-hpe-u1-s3",
            "name": "Ethics in Sport"
          }
        ]
      },
      {
        "id": "g9-hpe-u2",
        "name": "Health and Physical Fitness",
        "subUnits": [
          {
            "id": "g9-hpe-u2-s1",
            "name": "Components of Fitness"
          },
          {
            "id": "g9-hpe-u2-s2",
            "name": "Health-Related Fitness Activities"
          },
          {
            "id": "g9-hpe-u2-s3",
            "name": "Principles of Training"
          }
        ]
      },
      {
        "id": "g9-hpe-u3",
        "name": "Athletics",
        "subUnits": [
          {
            "id": "g9-hpe-u3-s1",
            "name": "Track Events"
          },
          {
            "id": "g9-hpe-u3-s2",
            "name": "Field Events"
          },
          {
            "id": "g9-hpe-u3-s3",
            "name": "Athletics Training Principles"
          }
        ]
      },
      {
        "id": "g9-hpe-u4",
        "name": "Football",
        "subUnits": [
          {
            "id": "g9-hpe-u4-s1",
            "name": "History and Rules"
          },
          {
            "id": "g9-hpe-u4-s2",
            "name": "Basic Skills and Techniques"
          },
          {
            "id": "g9-hpe-u4-s3",
            "name": "Tactics and Safety"
          }
        ]
      },
      {
        "id": "g9-hpe-u5",
        "name": "Volleyball",
        "subUnits": [
          {
            "id": "g9-hpe-u5-s1",
            "name": "History and Rules"
          },
          {
            "id": "g9-hpe-u5-s2",
            "name": "Basic Skills and Techniques"
          },
          {
            "id": "g9-hpe-u5-s3",
            "name": "Tactics and Safety"
          }
        ]
      },
      {
        "id": "g9-hpe-u6",
        "name": "Basketball",
        "subUnits": [
          {
            "id": "g9-hpe-u6-s1",
            "name": "History and Rules"
          },
          {
            "id": "g9-hpe-u6-s2",
            "name": "Basic Skills and Techniques"
          },
          {
            "id": "g9-hpe-u6-s3",
            "name": "Tactics and Safety"
          }
        ]
      },
      {
        "id": "g9-hpe-u7",
        "name": "Handball",
        "subUnits": [
          {
            "id": "g9-hpe-u7-s1",
            "name": "History and Rules"
          },
          {
            "id": "g9-hpe-u7-s2",
            "name": "Basic Skills and Techniques"
          },
          {
            "id": "g9-hpe-u7-s3",
            "name": "Tactics and Safety"
          }
        ]
      },
      {
        "id": "g9-hpe-u8",
        "name": "Self-Defense and Sport Ethics",
        "subUnits": [
          {
            "id": "g9-hpe-u8-s1",
            "name": "Basic Self-Defense Techniques"
          },
          {
            "id": "g9-hpe-u8-s2",
            "name": "Sportsmanship and Fair Play"
          },
          {
            "id": "g9-hpe-u8-s3",
            "name": "Sport-Related Injuries and Safety"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-math",
    "name": "Mathematics",
    "icon": "Calculator",
    "grade": "10",
    "units": [
      {
        "id": "g10-math-u1",
        "name": "Relations and Functions",
        "subUnits": [
          {
            "id": "g10-math-u1-s1",
            "name": "Ordered Pairs and Mappings"
          },
          {
            "id": "g10-math-u1-s2",
            "name": "Domain and Range"
          },
          {
            "id": "g10-math-u1-s3",
            "name": "Graphing Relations and Functions"
          }
        ]
      },
      {
        "id": "g10-math-u2",
        "name": "Polynomial Functions",
        "subUnits": [
          {
            "id": "g10-math-u2-s1",
            "name": "Introduction to Polynomial Functions"
          },
          {
            "id": "g10-math-u2-s2",
            "name": "Operations on Polynomials"
          },
          {
            "id": "g10-math-u2-s3",
            "name": "Zeros of Polynomials and Theorems"
          },
          {
            "id": "g10-math-u2-s4",
            "name": "Graphing Polynomial Functions"
          }
        ]
      },
      {
        "id": "g10-math-u3",
        "name": "Exponential and Logarithmic Functions",
        "subUnits": [
          {
            "id": "g10-math-u3-s1",
            "name": "Rules of Exponents"
          },
          {
            "id": "g10-math-u3-s2",
            "name": "Exponential Functions and Graphs"
          },
          {
            "id": "g10-math-u3-s3",
            "name": "Logarithms and Their Properties"
          },
          {
            "id": "g10-math-u3-s4",
            "name": "Logarithmic Functions and Graphs"
          }
        ]
      },
      {
        "id": "g10-math-u4",
        "name": "Trigonometric Functions",
        "subUnits": [
          {
            "id": "g10-math-u4-s1",
            "name": "Trigonometric Functions and Identities"
          },
          {
            "id": "g10-math-u4-s2",
            "name": "Graphs of Trigonometric Functions"
          },
          {
            "id": "g10-math-u4-s3",
            "name": "Solving Trigonometric Equations"
          }
        ]
      },
      {
        "id": "g10-math-u5",
        "name": "Circles",
        "subUnits": [
          {
            "id": "g10-math-u5-s1",
            "name": "Properties of Circles"
          },
          {
            "id": "g10-math-u5-s2",
            "name": "Angles and Arcs"
          },
          {
            "id": "g10-math-u5-s3",
            "name": "Tangents and Chords"
          }
        ]
      },
      {
        "id": "g10-math-u6",
        "name": "Solid Figures",
        "subUnits": [
          {
            "id": "g10-math-u6-s1",
            "name": "Types of Solid Figures"
          },
          {
            "id": "g10-math-u6-s2",
            "name": "Surface Area of Solids"
          },
          {
            "id": "g10-math-u6-s3",
            "name": "Volume of Solids"
          }
        ]
      },
      {
        "id": "g10-math-u7",
        "name": "Coordinate Geometry",
        "subUnits": [
          {
            "id": "g10-math-u7-s1",
            "name": "Distance Between Two Points"
          },
          {
            "id": "g10-math-u7-s2",
            "name": "Division of a Line Segment"
          },
          {
            "id": "g10-math-u7-s3",
            "name": "Equations of Lines and Slopes"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-phy",
    "name": "Physics",
    "icon": "Zap",
    "grade": "10",
    "units": [
      {
        "id": "g10-phy-u1",
        "name": "Vector Quantities",
        "subUnits": [
          {
            "id": "g10-phy-u1-s1",
            "name": "Vector Representation and Addition"
          },
          {
            "id": "g10-phy-u1-s2",
            "name": "Resolution of Vectors"
          },
          {
            "id": "g10-phy-u1-s3",
            "name": "Applications of Vectors in Motion"
          }
        ]
      },
      {
        "id": "g10-phy-u2",
        "name": "Uniformly Accelerated Motion",
        "subUnits": [
          {
            "id": "g10-phy-u2-s1",
            "name": "Motion in Two Dimensions"
          },
          {
            "id": "g10-phy-u2-s2",
            "name": "Projectile Motion"
          },
          {
            "id": "g10-phy-u2-s3",
            "name": "Circular Motion"
          }
        ]
      },
      {
        "id": "g10-phy-u3",
        "name": "Elasticity and Static Equilibrium of Rigid Body",
        "subUnits": [
          {
            "id": "g10-phy-u3-s1",
            "name": "Elastic Properties of Materials"
          },
          {
            "id": "g10-phy-u3-s2",
            "name": "Torque and Moments"
          },
          {
            "id": "g10-phy-u3-s3",
            "name": "Conditions for Static Equilibrium"
          }
        ]
      },
      {
        "id": "g10-phy-u4",
        "name": "Static and Current Electricity",
        "subUnits": [
          {
            "id": "g10-phy-u4-s1",
            "name": "Electric Charge and Coulomb's Law"
          },
          {
            "id": "g10-phy-u4-s2",
            "name": "Electric Fields and Potential"
          },
          {
            "id": "g10-phy-u4-s3",
            "name": "Electric Current, Resistance and Ohm's Law"
          },
          {
            "id": "g10-phy-u4-s4",
            "name": "Electric Circuits"
          }
        ]
      },
      {
        "id": "g10-phy-u5",
        "name": "Magnetism",
        "subUnits": [
          {
            "id": "g10-phy-u5-s1",
            "name": "Magnetic Fields and Forces"
          },
          {
            "id": "g10-phy-u5-s2",
            "name": "Electromagnetism"
          },
          {
            "id": "g10-phy-u5-s3",
            "name": "Electromagnetic Induction"
          }
        ]
      },
      {
        "id": "g10-phy-u6",
        "name": "Electromagnetic Waves and Geometrical Optics",
        "subUnits": [
          {
            "id": "g10-phy-u6-s1",
            "name": "The Electromagnetic Spectrum"
          },
          {
            "id": "g10-phy-u6-s2",
            "name": "Reflection of Light"
          },
          {
            "id": "g10-phy-u6-s3",
            "name": "Refraction and Lenses"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-che",
    "name": "Chemistry",
    "icon": "FlaskConical",
    "grade": "10",
    "units": [
      {
        "id": "g10-che-u1",
        "name": "Chemical Reactions and Stoichiometry",
        "subUnits": [
          {
            "id": "g10-che-u1-s1",
            "name": "Chemical Equations and Types of Reactions"
          },
          {
            "id": "g10-che-u1-s2",
            "name": "Oxidation-Reduction Reactions"
          },
          {
            "id": "g10-che-u1-s3",
            "name": "The Mole Concept"
          },
          {
            "id": "g10-che-u1-s4",
            "name": "Stoichiometric Calculations"
          }
        ]
      },
      {
        "id": "g10-che-u2",
        "name": "Mixtures and Solutions",
        "subUnits": [
          {
            "id": "g10-che-u2-s1",
            "name": "Heterogeneous and Homogeneous Mixtures"
          },
          {
            "id": "g10-che-u2-s2",
            "name": "Solubility"
          },
          {
            "id": "g10-che-u2-s3",
            "name": "Expressing Solution Concentration"
          }
        ]
      },
      {
        "id": "g10-che-u3",
        "name": "Acids, Bases and Salts",
        "subUnits": [
          {
            "id": "g10-che-u3-s1",
            "name": "Properties of Acids and Bases"
          },
          {
            "id": "g10-che-u3-s2",
            "name": "pH and Indicators"
          },
          {
            "id": "g10-che-u3-s3",
            "name": "Formation and Uses of Salts"
          }
        ]
      },
      {
        "id": "g10-che-u4",
        "name": "Metals and Nonmetals",
        "subUnits": [
          {
            "id": "g10-che-u4-s1",
            "name": "Classification and Properties of Metals and Nonmetals"
          },
          {
            "id": "g10-che-u4-s2",
            "name": "Extraction Methods"
          },
          {
            "id": "g10-che-u4-s3",
            "name": "Ethiopian Mineral Resources (Gold, Copper, Potash)"
          }
        ]
      },
      {
        "id": "g10-che-u5",
        "name": "Electrochemistry",
        "subUnits": [
          {
            "id": "g10-che-u5-s1",
            "name": "Electrical Conductivity"
          },
          {
            "id": "g10-che-u5-s2",
            "name": "Electrolysis"
          },
          {
            "id": "g10-che-u5-s3",
            "name": "Galvanic (Voltaic) Cells"
          }
        ]
      },
      {
        "id": "g10-che-u6",
        "name": "Hydrocarbons and Their Sources",
        "subUnits": [
          {
            "id": "g10-che-u6-s1",
            "name": "Alkanes"
          },
          {
            "id": "g10-che-u6-s2",
            "name": "Alkenes and Alkynes"
          },
          {
            "id": "g10-che-u6-s3",
            "name": "Aromatic Hydrocarbons"
          },
          {
            "id": "g10-che-u6-s4",
            "name": "Natural Sources of Hydrocarbons in Ethiopia"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-bio",
    "name": "Biology",
    "icon": "Dna",
    "grade": "10",
    "units": [
      {
        "id": "g10-bio-u1",
        "name": "Sub-fields of Biology",
        "subUnits": [
          {
            "id": "g10-bio-u1-s1",
            "name": "Branches of Biology"
          },
          {
            "id": "g10-bio-u1-s2",
            "name": "Careers Related to Biology"
          },
          {
            "id": "g10-bio-u1-s3",
            "name": "Biology and Other Disciplines"
          }
        ]
      },
      {
        "id": "g10-bio-u2",
        "name": "Plants",
        "subUnits": [
          {
            "id": "g10-bio-u2-s1",
            "name": "Plant Structure and Function"
          },
          {
            "id": "g10-bio-u2-s2",
            "name": "Photosynthesis and Respiration in Plants"
          },
          {
            "id": "g10-bio-u2-s3",
            "name": "Plant Growth and Development"
          },
          {
            "id": "g10-bio-u2-s4",
            "name": "Plant Classification"
          }
        ]
      },
      {
        "id": "g10-bio-u3",
        "name": "Biochemical Molecules",
        "subUnits": [
          {
            "id": "g10-bio-u3-s1",
            "name": "Carbohydrates"
          },
          {
            "id": "g10-bio-u3-s2",
            "name": "Proteins"
          },
          {
            "id": "g10-bio-u3-s3",
            "name": "Lipids"
          },
          {
            "id": "g10-bio-u3-s4",
            "name": "Nucleic Acids"
          }
        ]
      },
      {
        "id": "g10-bio-u4",
        "name": "Cell Reproduction",
        "subUnits": [
          {
            "id": "g10-bio-u4-s1",
            "name": "The Cell Cycle"
          },
          {
            "id": "g10-bio-u4-s2",
            "name": "Mitosis"
          },
          {
            "id": "g10-bio-u4-s3",
            "name": "Meiosis"
          }
        ]
      },
      {
        "id": "g10-bio-u5",
        "name": "Human Biology",
        "subUnits": [
          {
            "id": "g10-bio-u5-s1",
            "name": "The Digestive System"
          },
          {
            "id": "g10-bio-u5-s2",
            "name": "The Circulatory System"
          },
          {
            "id": "g10-bio-u5-s3",
            "name": "The Respiratory System"
          },
          {
            "id": "g10-bio-u5-s4",
            "name": "The Nervous System"
          }
        ]
      },
      {
        "id": "g10-bio-u6",
        "name": "Ecological Interaction",
        "subUnits": [
          {
            "id": "g10-bio-u6-s1",
            "name": "Interactions Within Ecosystems"
          },
          {
            "id": "g10-bio-u6-s2",
            "name": "Population Ecology"
          },
          {
            "id": "g10-bio-u6-s3",
            "name": "Human Impact on Ecological Balance"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-eng",
    "name": "English",
    "icon": "BookA",
    "grade": "10",
    "units": [
      {
        "id": "g10-eng-u1",
        "name": "Unit 1 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g10-eng-u1-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u1-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u1-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u1-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u2",
        "name": "Unit 2 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g10-eng-u2-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u2-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u2-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u2-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u3",
        "name": "Punctuality",
        "subUnits": [
          {
            "id": "g10-eng-u3-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u3-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u3-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u3-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u4",
        "name": "Tourist Attractions",
        "subUnits": [
          {
            "id": "g10-eng-u4-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u4-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u4-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u4-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u5",
        "name": "Honey Production and Processing",
        "subUnits": [
          {
            "id": "g10-eng-u5-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u5-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u5-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u5-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u6",
        "name": "Migration",
        "subUnits": [
          {
            "id": "g10-eng-u6-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u6-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u6-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u6-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u7",
        "name": "Branding Ethiopia and National Identity",
        "subUnits": [
          {
            "id": "g10-eng-u7-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u7-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u7-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u7-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u8",
        "name": "Traditional Medicine and Moringa",
        "subUnits": [
          {
            "id": "g10-eng-u8-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u8-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u8-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u8-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u9",
        "name": "Multilingualism in Ethiopia",
        "subUnits": [
          {
            "id": "g10-eng-u9-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u9-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u9-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u9-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-eng-u10",
        "name": "Digital vs. Satellite Television",
        "subUnits": [
          {
            "id": "g10-eng-u10-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-eng-u10-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-eng-u10-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-eng-u10-s4",
            "name": "Writing"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-his",
    "name": "History",
    "icon": "Landmark",
    "grade": "10",
    "units": [
      {
        "id": "g10-his-u1",
        "name": "Capitalism and Nationalism in 19th-Century Europe",
        "subUnits": [
          {
            "id": "g10-his-u1-s1",
            "name": "Rise of Industrial Capitalism"
          },
          {
            "id": "g10-his-u1-s2",
            "name": "Nationalism and Unification Movements"
          },
          {
            "id": "g10-his-u1-s3",
            "name": "European Political Change, 1815–1870s"
          }
        ]
      },
      {
        "id": "g10-his-u2",
        "name": "Colonialism in Africa",
        "subUnits": [
          {
            "id": "g10-his-u2-s1",
            "name": "The Scramble for Africa"
          },
          {
            "id": "g10-his-u2-s2",
            "name": "Colonial Administration Systems"
          },
          {
            "id": "g10-his-u2-s3",
            "name": "African Resistance to Colonialism"
          }
        ]
      },
      {
        "id": "g10-his-u3",
        "name": "Social, Economic and Political Developments in Ethiopia mid-19th C. to 1941",
        "subUnits": [
          {
            "id": "g10-his-u3-s1",
            "name": "Long-Distance Trade"
          },
          {
            "id": "g10-his-u3-s2",
            "name": "The Making of the Modern Ethiopian State"
          },
          {
            "id": "g10-his-u3-s3",
            "name": "External Aggression and Patriotic Resistance"
          }
        ]
      },
      {
        "id": "g10-his-u4",
        "name": "Society and Politics in the Age of World Wars 1914-1945",
        "subUnits": [
          {
            "id": "g10-his-u4-s1",
            "name": "Causes and Consequences of World War I"
          },
          {
            "id": "g10-his-u4-s2",
            "name": "The Russian Revolution and the League of Nations"
          },
          {
            "id": "g10-his-u4-s3",
            "name": "The Great Depression and the Rise of Fascism"
          }
        ]
      },
      {
        "id": "g10-his-u5",
        "name": "Global and Regional Developments Since 1945",
        "subUnits": [
          {
            "id": "g10-his-u5-s1",
            "name": "Formation and Achievements of the United Nations"
          },
          {
            "id": "g10-his-u5-s2",
            "name": "Rise of the Superpowers and Onset of the Cold War"
          },
          {
            "id": "g10-his-u5-s3",
            "name": "Cold War Dynamics in Asia"
          }
        ]
      },
      {
        "id": "g10-his-u6",
        "name": "Ethiopia: Internal Developments and External Influences from 1941 to 1991",
        "subUnits": [
          {
            "id": "g10-his-u6-s1",
            "name": "Post-1941 Political and Economic Change"
          },
          {
            "id": "g10-his-u6-s2",
            "name": "The 1974 Revolution and the Derg Period"
          },
          {
            "id": "g10-his-u6-s3",
            "name": "External Relations, 1941–1991"
          }
        ]
      },
      {
        "id": "g10-his-u7",
        "name": "Post-1991 Ethiopia",
        "subUnits": [
          {
            "id": "g10-his-u7-s1",
            "name": "Political Transition After 1991"
          },
          {
            "id": "g10-his-u7-s2",
            "name": "Federal Restructuring"
          },
          {
            "id": "g10-his-u7-s3",
            "name": "Recent Economic and Social Developments"
          }
        ]
      },
      {
        "id": "g10-his-u8",
        "name": "Indigenous Knowledge and Heritage in Ethiopia",
        "subUnits": [
          {
            "id": "g10-his-u8-s1",
            "name": "Indigenous Knowledge Systems"
          },
          {
            "id": "g10-his-u8-s2",
            "name": "Cultural and Historical Heritage Sites"
          },
          {
            "id": "g10-his-u8-s3",
            "name": "Preservation and Value of Heritage"
          }
        ]
      },
      {
        "id": "g10-his-u9",
        "name": "Ethiopia and the Horn in Contemporary Times",
        "subUnits": [
          {
            "id": "g10-his-u9-s1",
            "name": "Regional Relations in the Horn of Africa"
          },
          {
            "id": "g10-his-u9-s2",
            "name": "Contemporary Challenges and Cooperation"
          },
          {
            "id": "g10-his-u9-s3",
            "name": "Ethiopia's Role in Regional Affairs"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-geo",
    "name": "Geography",
    "icon": "Globe",
    "grade": "10",
    "units": [
      {
        "id": "g10-geo-u1",
        "name": "Landforms of Africa",
        "subUnits": [
          {
            "id": "g10-geo-u1-s1",
            "name": "Major Landform Regions of Africa"
          },
          {
            "id": "g10-geo-u1-s2",
            "name": "The Atlas Mountains, Sahara and Sahel"
          },
          {
            "id": "g10-geo-u1-s3",
            "name": "The Rift Valley and Southern African Highlands"
          }
        ]
      },
      {
        "id": "g10-geo-u2",
        "name": "Climate of Africa",
        "subUnits": [
          {
            "id": "g10-geo-u2-s1",
            "name": "Factors Affecting African Climate"
          },
          {
            "id": "g10-geo-u2-s2",
            "name": "Climate Zones of Africa"
          },
          {
            "id": "g10-geo-u2-s3",
            "name": "Climate Change Impacts on Africa"
          }
        ]
      },
      {
        "id": "g10-geo-u3",
        "name": "Drainage Systems and Natural Resources of Africa",
        "subUnits": [
          {
            "id": "g10-geo-u3-s1",
            "name": "Major River Basins and Lakes of Africa"
          },
          {
            "id": "g10-geo-u3-s2",
            "name": "Mineral Resources of Africa"
          },
          {
            "id": "g10-geo-u3-s3",
            "name": "Ecosystems and Resource Conservation"
          }
        ]
      },
      {
        "id": "g10-geo-u4",
        "name": "Population of Africa",
        "subUnits": [
          {
            "id": "g10-geo-u4-s1",
            "name": "Demographic Trends and Age Structure"
          },
          {
            "id": "g10-geo-u4-s2",
            "name": "Urbanization in Africa"
          },
          {
            "id": "g10-geo-u4-s3",
            "name": "Rural Life and Settlement Patterns"
          }
        ]
      },
      {
        "id": "g10-geo-u5",
        "name": "Major Economic and Cultural Activities of Africa",
        "subUnits": [
          {
            "id": "g10-geo-u5-s1",
            "name": "Employment Structure and Unemployment"
          },
          {
            "id": "g10-geo-u5-s2",
            "name": "Agenda 2063 and the Sustainable Development Goals"
          },
          {
            "id": "g10-geo-u5-s3",
            "name": "Linguistic and Religious Diversity in Africa"
          }
        ]
      },
      {
        "id": "g10-geo-u6",
        "name": "Population Change and Human-Environment Relationships in Africa",
        "subUnits": [
          {
            "id": "g10-geo-u6-s1",
            "name": "Global Population Change"
          },
          {
            "id": "g10-geo-u6-s2",
            "name": "Human-Environment Interaction"
          },
          {
            "id": "g10-geo-u6-s3",
            "name": "Indigenous Knowledge in Resource Conservation"
          }
        ]
      },
      {
        "id": "g10-geo-u7",
        "name": "Geographic Issues and Public Concerns in Africa",
        "subUnits": [
          {
            "id": "g10-geo-u7-s1",
            "name": "Unplanned Urbanization"
          },
          {
            "id": "g10-geo-u7-s2",
            "name": "Migration Issues"
          },
          {
            "id": "g10-geo-u7-s3",
            "name": "Coastal Pollution"
          }
        ]
      },
      {
        "id": "g10-geo-u8",
        "name": "Geospatial Information and Data Processing",
        "subUnits": [
          {
            "id": "g10-geo-u8-s1",
            "name": "Basic Concepts of Geospatial Information"
          },
          {
            "id": "g10-geo-u8-s2",
            "name": "Sources and Tools of Geographic Data"
          },
          {
            "id": "g10-geo-u8-s3",
            "name": "Interpreting Graphs, Charts and Maps"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-cve",
    "name": "Citizenship Education",
    "icon": "Scale",
    "grade": "10",
    "units": [
      {
        "id": "g10-cve-u1",
        "name": "Democracy and Democratic Systems",
        "subUnits": [
          {
            "id": "g10-cve-u1-s1",
            "name": "Principles of Democracy"
          },
          {
            "id": "g10-cve-u1-s2",
            "name": "Representative Democracy in Ethiopia"
          },
          {
            "id": "g10-cve-u1-s3",
            "name": "Challenges to Democracy"
          }
        ]
      },
      {
        "id": "g10-cve-u2",
        "name": "Digital Ethics and Citizenship",
        "subUnits": [
          {
            "id": "g10-cve-u2-s1",
            "name": "Ethics in the Digital Age"
          },
          {
            "id": "g10-cve-u2-s2",
            "name": "Digital Rights and Responsibilities"
          },
          {
            "id": "g10-cve-u2-s3",
            "name": "Combating Misinformation"
          }
        ]
      },
      {
        "id": "g10-cve-u3",
        "name": "Governance and Public Institutions",
        "subUnits": [
          {
            "id": "g10-cve-u3-s1",
            "name": "Structure of Government in Ethiopia"
          },
          {
            "id": "g10-cve-u3-s2",
            "name": "Transparency and Accountability"
          },
          {
            "id": "g10-cve-u3-s3",
            "name": "Federalism in Ethiopia"
          }
        ]
      },
      {
        "id": "g10-cve-u4",
        "name": "Patriotism and National Service",
        "subUnits": [
          {
            "id": "g10-cve-u4-s1",
            "name": "Meaning of Patriotism"
          },
          {
            "id": "g10-cve-u4-s2",
            "name": "National Service and Civic Duty"
          },
          {
            "id": "g10-cve-u4-s3",
            "name": "Patriotism in Ethiopian History"
          }
        ]
      },
      {
        "id": "g10-cve-u5",
        "name": "Human Rights and Responsibilities",
        "subUnits": [
          {
            "id": "g10-cve-u5-s1",
            "name": "Fundamental Human Rights"
          },
          {
            "id": "g10-cve-u5-s2",
            "name": "Rights and Corresponding Responsibilities"
          },
          {
            "id": "g10-cve-u5-s3",
            "name": "Protecting Vulnerable Groups"
          }
        ]
      },
      {
        "id": "g10-cve-u6",
        "name": "Rule of Law and Justice",
        "subUnits": [
          {
            "id": "g10-cve-u6-s1",
            "name": "The Constitution and Rule of Law"
          },
          {
            "id": "g10-cve-u6-s2",
            "name": "The Justice System in Ethiopia"
          },
          {
            "id": "g10-cve-u6-s3",
            "name": "Anti-Corruption Measures"
          }
        ]
      },
      {
        "id": "g10-cve-u7",
        "name": "Civic Participation",
        "subUnits": [
          {
            "id": "g10-cve-u7-s1",
            "name": "Forms of Civic Participation"
          },
          {
            "id": "g10-cve-u7-s2",
            "name": "Community Organizations"
          },
          {
            "id": "g10-cve-u7-s3",
            "name": "Youth Participation in Civic Life"
          }
        ]
      },
      {
        "id": "g10-cve-u8",
        "name": "Ethiopia's Role in Regional and Global Affairs",
        "subUnits": [
          {
            "id": "g10-cve-u8-s1",
            "name": "Ethiopia's Foreign Policy Priorities"
          },
          {
            "id": "g10-cve-u8-s2",
            "name": "Regional Organizations and Cooperation"
          },
          {
            "id": "g10-cve-u8-s3",
            "name": "Ethiopia in International Institutions"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-eco",
    "name": "Economics",
    "icon": "TrendingUp",
    "grade": "10",
    "units": [
      {
        "id": "g10-eco-u1",
        "name": "Theory of Consumer Behaviour",
        "subUnits": [
          {
            "id": "g10-eco-u1-s1",
            "name": "The Concept of Utility"
          },
          {
            "id": "g10-eco-u1-s2",
            "name": "The Cardinal Utility Theory"
          },
          {
            "id": "g10-eco-u1-s3",
            "name": "The Consumer Maximization Problem"
          },
          {
            "id": "g10-eco-u1-s4",
            "name": "Introduction to the Ordinal Utility Theory"
          }
        ]
      },
      {
        "id": "g10-eco-u2",
        "name": "Theories of Demand and Supply",
        "subUnits": [
          {
            "id": "g10-eco-u2-s1",
            "name": "Theory of Demand"
          },
          {
            "id": "g10-eco-u2-s2",
            "name": "Theory of Supply"
          },
          {
            "id": "g10-eco-u2-s3",
            "name": "Market Equilibrium"
          },
          {
            "id": "g10-eco-u2-s4",
            "name": "Elasticities of Demand and Supply"
          }
        ]
      },
      {
        "id": "g10-eco-u3",
        "name": "Theories of Production and Cost",
        "subUnits": [
          {
            "id": "g10-eco-u3-s1",
            "name": "Theory of Production"
          },
          {
            "id": "g10-eco-u3-s2",
            "name": "Short-Run and Long-Run Costs"
          },
          {
            "id": "g10-eco-u3-s3",
            "name": "Cost Minimization"
          }
        ]
      },
      {
        "id": "g10-eco-u4",
        "name": "Market Structure",
        "subUnits": [
          {
            "id": "g10-eco-u4-s1",
            "name": "Perfectly Competitive Markets"
          },
          {
            "id": "g10-eco-u4-s2",
            "name": "Pure Monopoly Market"
          },
          {
            "id": "g10-eco-u4-s3",
            "name": "Monopolistically Competitive Market"
          },
          {
            "id": "g10-eco-u4-s4",
            "name": "Oligopoly Market"
          }
        ]
      },
      {
        "id": "g10-eco-u5",
        "name": "National Income Accounting",
        "subUnits": [
          {
            "id": "g10-eco-u5-s1",
            "name": "Measuring GDP and GNP"
          },
          {
            "id": "g10-eco-u5-s2",
            "name": "Approaches to National Income Measurement"
          },
          {
            "id": "g10-eco-u5-s3",
            "name": "Limitations of National Income Statistics"
          }
        ]
      },
      {
        "id": "g10-eco-u6",
        "name": "Money, Banking and Public Finance",
        "subUnits": [
          {
            "id": "g10-eco-u6-s1",
            "name": "Functions and Types of Money"
          },
          {
            "id": "g10-eco-u6-s2",
            "name": "The Banking System"
          },
          {
            "id": "g10-eco-u6-s3",
            "name": "Government Revenue and Expenditure"
          }
        ]
      },
      {
        "id": "g10-eco-u7",
        "name": "The Ethiopian Economy: Sectors and Development",
        "subUnits": [
          {
            "id": "g10-eco-u7-s1",
            "name": "Agricultural Sector"
          },
          {
            "id": "g10-eco-u7-s2",
            "name": "Industrial Sector"
          },
          {
            "id": "g10-eco-u7-s3",
            "name": "Service Sector and Development Strategy"
          }
        ]
      },
      {
        "id": "g10-eco-u8",
        "name": "Business Startups and Innovation",
        "subUnits": [
          {
            "id": "g10-eco-u8-s1",
            "name": "Innovation and Entrepreneurship"
          },
          {
            "id": "g10-eco-u8-s2",
            "name": "Types of Business Organizations"
          },
          {
            "id": "g10-eco-u8-s3",
            "name": "Feasibility Analysis for Startups"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-amh",
    "name": "Amharic",
    "icon": "MessageSquare",
    "grade": "10",
    "units": [
      {
        "id": "g10-amh-u1",
        "name": "Language and Society",
        "subUnits": [
          {
            "id": "g10-amh-u1-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u1-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u1-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u1-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-amh-u2",
        "name": "Unit 2 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g10-amh-u2-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u2-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u2-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u2-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-amh-u3",
        "name": "Unit 3 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g10-amh-u3-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u3-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u3-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u3-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-amh-u4",
        "name": "Unit 4 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g10-amh-u4-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u4-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u4-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u4-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-amh-u5",
        "name": "Marriage Traditions in Ethiopia",
        "subUnits": [
          {
            "id": "g10-amh-u5-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u5-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u5-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u5-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-amh-u6",
        "name": "Women in Development",
        "subUnits": [
          {
            "id": "g10-amh-u6-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u6-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u6-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u6-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-amh-u7",
        "name": "Unit 7 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g10-amh-u7-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u7-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u7-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u7-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-amh-u8",
        "name": "Unit 8 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g10-amh-u8-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u8-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u8-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u8-s4",
            "name": "Writing"
          }
        ]
      },
      {
        "id": "g10-amh-u9",
        "name": "Unit 9 (TBD — verify against textbook)",
        "subUnits": [
          {
            "id": "g10-amh-u9-s1",
            "name": "Listening and Speaking"
          },
          {
            "id": "g10-amh-u9-s2",
            "name": "Reading Comprehension"
          },
          {
            "id": "g10-amh-u9-s3",
            "name": "Vocabulary and Grammar"
          },
          {
            "id": "g10-amh-u9-s4",
            "name": "Writing"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-ict",
    "name": "Information Technology",
    "icon": "MonitorSmartphone",
    "grade": "10",
    "units": [
      {
        "id": "g10-ict-u1",
        "name": "Organization of Files",
        "subUnits": [
          {
            "id": "g10-ict-u1-s1",
            "name": "Advanced File and Folder Management"
          },
          {
            "id": "g10-ict-u1-s2",
            "name": "File Systems and Storage Devices"
          },
          {
            "id": "g10-ict-u1-s3",
            "name": "Backup Strategies"
          }
        ]
      },
      {
        "id": "g10-ict-u2",
        "name": "Computer Network",
        "subUnits": [
          {
            "id": "g10-ict-u2-s1",
            "name": "Network Architecture and Protocols"
          },
          {
            "id": "g10-ict-u2-s2",
            "name": "Wired and Wireless Networking"
          },
          {
            "id": "g10-ict-u2-s3",
            "name": "Network Troubleshooting Basics"
          }
        ]
      },
      {
        "id": "g10-ict-u3",
        "name": "Application Software",
        "subUnits": [
          {
            "id": "g10-ict-u3-s1",
            "name": "Advanced Word Processing"
          },
          {
            "id": "g10-ict-u3-s2",
            "name": "Advanced Spreadsheet Functions"
          },
          {
            "id": "g10-ict-u3-s3",
            "name": "Database Management Systems"
          }
        ]
      },
      {
        "id": "g10-ict-u4",
        "name": "Image Processing and Multimedia",
        "subUnits": [
          {
            "id": "g10-ict-u4-s1",
            "name": "Image File Formats and Editing"
          },
          {
            "id": "g10-ict-u4-s2",
            "name": "Audio and Video Editing Basics"
          },
          {
            "id": "g10-ict-u4-s3",
            "name": "Multimedia Project Production"
          }
        ]
      },
      {
        "id": "g10-ict-u5",
        "name": "Information and Computer Security",
        "subUnits": [
          {
            "id": "g10-ict-u5-s1",
            "name": "Types of Cyber Threats"
          },
          {
            "id": "g10-ict-u5-s2",
            "name": "Data Encryption and Protection"
          },
          {
            "id": "g10-ict-u5-s3",
            "name": "Digital Ethics and Legal Issues"
          }
        ]
      },
      {
        "id": "g10-ict-u6",
        "name": "Fundamentals of Programming",
        "subUnits": [
          {
            "id": "g10-ict-u6-s1",
            "name": "Variables, Data Types and Operators"
          },
          {
            "id": "g10-ict-u6-s2",
            "name": "Control Structures"
          },
          {
            "id": "g10-ict-u6-s3",
            "name": "Writing and Debugging Simple Programs"
          }
        ]
      }
    ]
  },
  {
    "id": "g10-hpe",
    "name": "Health and Physical Education",
    "icon": "Activity",
    "grade": "10",
    "units": [
      {
        "id": "g10-hpe-u1",
        "name": "Sport and Society",
        "subUnits": [
          {
            "id": "g10-hpe-u1-s1",
            "name": "Sport, Media and Politics"
          },
          {
            "id": "g10-hpe-u1-s2",
            "name": "Sport and Religion"
          },
          {
            "id": "g10-hpe-u1-s3",
            "name": "Sport for Humanitarian and Peace Development"
          }
        ]
      },
      {
        "id": "g10-hpe-u2",
        "name": "Health and Physical Fitness",
        "subUnits": [
          {
            "id": "g10-hpe-u2-s1",
            "name": "Advanced Components of Fitness"
          },
          {
            "id": "g10-hpe-u2-s2",
            "name": "Fitness Testing and Evaluation"
          },
          {
            "id": "g10-hpe-u2-s3",
            "name": "Designing a Personal Fitness Program"
          }
        ]
      },
      {
        "id": "g10-hpe-u3",
        "name": "Athletics",
        "subUnits": [
          {
            "id": "g10-hpe-u3-s1",
            "name": "Advanced Track Techniques"
          },
          {
            "id": "g10-hpe-u3-s2",
            "name": "Advanced Field Techniques"
          },
          {
            "id": "g10-hpe-u3-s3",
            "name": "Competition Rules and Officiating"
          }
        ]
      },
      {
        "id": "g10-hpe-u4",
        "name": "Football",
        "subUnits": [
          {
            "id": "g10-hpe-u4-s1",
            "name": "Advanced Techniques and Tactics"
          },
          {
            "id": "g10-hpe-u4-s2",
            "name": "Team Strategy and Positioning"
          },
          {
            "id": "g10-hpe-u4-s3",
            "name": "Officiating and Safety"
          }
        ]
      },
      {
        "id": "g10-hpe-u5",
        "name": "Volleyball",
        "subUnits": [
          {
            "id": "g10-hpe-u5-s1",
            "name": "Advanced Techniques and Tactics"
          },
          {
            "id": "g10-hpe-u5-s2",
            "name": "Team Strategy and Positioning"
          },
          {
            "id": "g10-hpe-u5-s3",
            "name": "Officiating and Safety"
          }
        ]
      },
      {
        "id": "g10-hpe-u6",
        "name": "Basketball",
        "subUnits": [
          {
            "id": "g10-hpe-u6-s1",
            "name": "Advanced Techniques and Tactics"
          },
          {
            "id": "g10-hpe-u6-s2",
            "name": "Team Strategy and Positioning"
          },
          {
            "id": "g10-hpe-u6-s3",
            "name": "Officiating and Safety"
          }
        ]
      },
      {
        "id": "g10-hpe-u7",
        "name": "Handball",
        "subUnits": [
          {
            "id": "g10-hpe-u7-s1",
            "name": "Advanced Techniques and Tactics"
          },
          {
            "id": "g10-hpe-u7-s2",
            "name": "Team Strategy and Positioning"
          },
          {
            "id": "g10-hpe-u7-s3",
            "name": "Officiating and Safety"
          }
        ]
      },
      {
        "id": "g10-hpe-u8",
        "name": "Self-Defense and Sport Ethics",
        "subUnits": [
          {
            "id": "g10-hpe-u8-s1",
            "name": "Intermediate Self-Defense Techniques"
          },
          {
            "id": "g10-hpe-u8-s2",
            "name": "Doping and Its Consequences"
          },
          {
            "id": "g10-hpe-u8-s3",
            "name": "Ethics, Fair Play and Injury Prevention"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-eng",
    "name": "English",
    "icon": "BookA",
    "grade": "11",
    "units": [
      {
        "id": "g11-eng-u1",
        "name": "The African Union",
        "subUnits": [
          {
            "id": "g11-eng-u1-s1",
            "name": "Reading and Vocabulary: AU History"
          },
          {
            "id": "g11-eng-u1-s2",
            "name": "Grammar: Tense Revisions"
          },
          {
            "id": "g11-eng-u1-s3",
            "name": "Writing: Expository Essays"
          }
        ]
      },
      {
        "id": "g11-eng-u2",
        "name": "Education",
        "subUnits": [
          {
            "id": "g11-eng-u2-s1",
            "name": "Reading: Education for Development"
          },
          {
            "id": "g11-eng-u2-s2",
            "name": "Grammar: Conditional Sentences"
          },
          {
            "id": "g11-eng-u2-s3",
            "name": "Speaking: Debating Educational Policies"
          }
        ]
      },
      {
        "id": "g11-eng-u3",
        "name": "Traditional and Modern Medicine",
        "subUnits": [
          {
            "id": "g11-eng-u3-s1",
            "name": "Reading: Healthcare Systems"
          },
          {
            "id": "g11-eng-u3-s2",
            "name": "Grammar: Relative Clauses"
          },
          {
            "id": "g11-eng-u3-s3",
            "name": "Writing: Argumentative Texts"
          }
        ]
      },
      {
        "id": "g11-eng-u4",
        "name": "Tourism and Wildlife",
        "subUnits": [
          {
            "id": "g11-eng-u4-s1",
            "name": "Reading: Eco-tourism in Ethiopia"
          },
          {
            "id": "g11-eng-u4-s2",
            "name": "Grammar: Passive Voice"
          },
          {
            "id": "g11-eng-u4-s3",
            "name": "Writing: Descriptive Writing"
          }
        ]
      },
      {
        "id": "g11-eng-u5",
        "name": "Climate Change and Environment",
        "subUnits": [
          {
            "id": "g11-eng-u5-s1",
            "name": "Reading: Global Warming Impacts"
          },
          {
            "id": "g11-eng-u5-s2",
            "name": "Grammar: Reported Speech"
          },
          {
            "id": "g11-eng-u5-s3",
            "name": "Speaking: Environmental Campaigns"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-ict",
    "name": "Information Technology",
    "icon": "MonitorSmartphone",
    "grade": "11",
    "units": [
      {
        "id": "g11-ict-u1",
        "name": "Information Systems",
        "subUnits": [
          {
            "id": "g11-ict-u1-s1",
            "name": "Concepts of Information Systems"
          },
          {
            "id": "g11-ict-u1-s2",
            "name": "Types of Information Systems"
          },
          {
            "id": "g11-ict-u1-s3",
            "name": "IT in Business and Society"
          }
        ]
      },
      {
        "id": "g11-ict-u2",
        "name": "Enhancing the Use of Software",
        "subUnits": [
          {
            "id": "g11-ict-u2-s1",
            "name": "Advanced Word Processing Features"
          },
          {
            "id": "g11-ict-u2-s2",
            "name": "Advanced Spreadsheet Analysis"
          },
          {
            "id": "g11-ict-u2-s3",
            "name": "Presentation Software Techniques"
          }
        ]
      },
      {
        "id": "g11-ict-u3",
        "name": "Computer Network and Internet",
        "subUnits": [
          {
            "id": "g11-ict-u3-s1",
            "name": "Network Topologies and Protocols"
          },
          {
            "id": "g11-ict-u3-s2",
            "name": "Internet Services and Security"
          },
          {
            "id": "g11-ict-u3-s3",
            "name": "E-commerce and E-learning"
          }
        ]
      },
      {
        "id": "g11-ict-u4",
        "name": "Web Design",
        "subUnits": [
          {
            "id": "g11-ict-u4-s1",
            "name": "HTML Basics and Tags"
          },
          {
            "id": "g11-ict-u4-s2",
            "name": "Cascading Style Sheets (CSS)"
          },
          {
            "id": "g11-ict-u4-s3",
            "name": "Publishing a Website"
          }
        ]
      },
      {
        "id": "g11-ict-u5",
        "name": "Fundamentals of Programming",
        "subUnits": [
          {
            "id": "g11-ict-u5-s1",
            "name": "Introduction to C++"
          },
          {
            "id": "g11-ict-u5-s2",
            "name": "Control Structures in C++"
          },
          {
            "id": "g11-ict-u5-s3",
            "name": "Functions and Arrays"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-math-nat",
    "name": "Mathematics",
    "icon": "Calculator",
    "grade": "11",
    "stream": "Natural",
    "units": [
      {
        "id": "g11-math-nat-u1",
        "name": "Relations and Functions",
        "subUnits": [
          {
            "id": "g11-math-nat-u1-s1",
            "name": "Review of Relations and Functions"
          },
          {
            "id": "g11-math-nat-u1-s2",
            "name": "Combinations and Composition of Functions"
          },
          {
            "id": "g11-math-nat-u1-s3",
            "name": "Inverse Functions"
          }
        ]
      },
      {
        "id": "g11-math-nat-u2",
        "name": "Rational Expressions and Functions",
        "subUnits": [
          {
            "id": "g11-math-nat-u2-s1",
            "name": "Simplification of Rational Expressions"
          },
          {
            "id": "g11-math-nat-u2-s2",
            "name": "Graphs of Rational Functions"
          },
          {
            "id": "g11-math-nat-u2-s3",
            "name": "Solving Rational Equations and Inequalities"
          }
        ]
      },
      {
        "id": "g11-math-nat-u3",
        "name": "Coordinate Geometry",
        "subUnits": [
          {
            "id": "g11-math-nat-u3-s1",
            "name": "Straight Lines"
          },
          {
            "id": "g11-math-nat-u3-s2",
            "name": "Conic Sections: Circles and Parabolas"
          },
          {
            "id": "g11-math-nat-u3-s3",
            "name": "Conic Sections: Ellipses and Hyperbolas"
          }
        ]
      },
      {
        "id": "g11-math-nat-u4",
        "name": "Mathematical Reasoning",
        "subUnits": [
          {
            "id": "g11-math-nat-u4-s1",
            "name": "Logic and Propositions"
          },
          {
            "id": "g11-math-nat-u4-s2",
            "name": "Logical Connectives and Truth Tables"
          },
          {
            "id": "g11-math-nat-u4-s3",
            "name": "Arguments and Validity"
          }
        ]
      },
      {
        "id": "g11-math-nat-u5",
        "name": "Statistics and Probability",
        "subUnits": [
          {
            "id": "g11-math-nat-u5-s1",
            "name": "Measures of Central Tendency and Dispersion"
          },
          {
            "id": "g11-math-nat-u5-s2",
            "name": "Permutations and Combinations"
          },
          {
            "id": "g11-math-nat-u5-s3",
            "name": "Introduction to Probability"
          }
        ]
      },
      {
        "id": "g11-math-nat-u6",
        "name": "Matrices and Determinants",
        "subUnits": [
          {
            "id": "g11-math-nat-u6-s1",
            "name": "Operations on Matrices"
          },
          {
            "id": "g11-math-nat-u6-s2",
            "name": "Determinants of Square Matrices"
          },
          {
            "id": "g11-math-nat-u6-s3",
            "name": "Inverse of a Matrix and Systems of Equations"
          }
        ]
      },
      {
        "id": "g11-math-nat-u7",
        "name": "Complex Numbers",
        "subUnits": [
          {
            "id": "g11-math-nat-u7-s1",
            "name": "The Concept of Complex Numbers"
          },
          {
            "id": "g11-math-nat-u7-s2",
            "name": "Operations on Complex Numbers"
          },
          {
            "id": "g11-math-nat-u7-s3",
            "name": "Polar Form and Roots of Complex Numbers"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-phy-nat",
    "name": "Physics",
    "icon": "Zap",
    "grade": "11",
    "stream": "Natural",
    "units": [
      {
        "id": "g11-phy-u1",
        "name": "Measurement and Practical Work",
        "subUnits": [
          {
            "id": "g11-phy-u1-s1",
            "name": "Errors in Measurement"
          },
          {
            "id": "g11-phy-u1-s2",
            "name": "Significant Figures and Dimensional Analysis"
          }
        ]
      },
      {
        "id": "g11-phy-u2",
        "name": "Vector Quantities",
        "subUnits": [
          {
            "id": "g11-phy-u2-s1",
            "name": "Vector Addition and Subtraction"
          },
          {
            "id": "g11-phy-u2-s2",
            "name": "Resolution and Dot/Cross Products"
          }
        ]
      },
      {
        "id": "g11-phy-u3",
        "name": "Kinematics",
        "subUnits": [
          {
            "id": "g11-phy-u3-s1",
            "name": "Motion in 1D and 2D"
          },
          {
            "id": "g11-phy-u3-s2",
            "name": "Projectile and Circular Motion"
          },
          {
            "id": "g11-phy-u3-s3",
            "name": "Relative Velocity"
          }
        ]
      },
      {
        "id": "g11-phy-u4",
        "name": "Dynamics",
        "subUnits": [
          {
            "id": "g11-phy-u4-s1",
            "name": "Newton's Laws of Motion"
          },
          {
            "id": "g11-phy-u4-s2",
            "name": "Friction and Centripetal Force"
          },
          {
            "id": "g11-phy-u4-s3",
            "name": "Conservation of Linear Momentum"
          }
        ]
      },
      {
        "id": "g11-phy-u5",
        "name": "Work, Energy and Power",
        "subUnits": [
          {
            "id": "g11-phy-u5-s1",
            "name": "Work Done by Constant and Variable Forces"
          },
          {
            "id": "g11-phy-u5-s2",
            "name": "Kinetic and Potential Energy"
          },
          {
            "id": "g11-phy-u5-s3",
            "name": "Conservation of Energy and Power"
          }
        ]
      },
      {
        "id": "g11-phy-u6",
        "name": "Rotational Motion",
        "subUnits": [
          {
            "id": "g11-phy-u6-s1",
            "name": "Kinematics of Rotational Motion"
          },
          {
            "id": "g11-phy-u6-s2",
            "name": "Torque and Angular Momentum"
          },
          {
            "id": "g11-phy-u6-s3",
            "name": "Moment of Inertia"
          }
        ]
      },
      {
        "id": "g11-phy-u7",
        "name": "Equilibrium",
        "subUnits": [
          {
            "id": "g11-phy-u7-s1",
            "name": "Conditions of Equilibrium"
          },
          {
            "id": "g11-phy-u7-s2",
            "name": "Center of Mass and Gravity"
          }
        ]
      },
      {
        "id": "g11-phy-u8",
        "name": "Properties of Bulk Matter",
        "subUnits": [
          {
            "id": "g11-phy-u8-s1",
            "name": "Elasticity and Hooke's Law"
          },
          {
            "id": "g11-phy-u8-s2",
            "name": "Fluid Statics and Pressure"
          },
          {
            "id": "g11-phy-u8-s3",
            "name": "Fluid Dynamics and Bernoulli's Principle"
          },
          {
            "id": "g11-phy-u8-s4",
            "name": "Heat, Temperature and Thermal Expansion"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-che-nat",
    "name": "Chemistry",
    "icon": "FlaskConical",
    "grade": "11",
    "stream": "Natural",
    "units": [
      {
        "id": "g11-che-u1",
        "name": "Fundamental Concepts of Chemistry",
        "subUnits": [
          {
            "id": "g11-che-u1-s1",
            "name": "The Scope of Chemistry"
          },
          {
            "id": "g11-che-u1-s2",
            "name": "Measurements and Scientific Notation"
          }
        ]
      },
      {
        "id": "g11-che-u2",
        "name": "Atomic Structure and Periodic Table",
        "subUnits": [
          {
            "id": "g11-che-u2-s1",
            "name": "Historical Development of Atomic Theory"
          },
          {
            "id": "g11-che-u2-s2",
            "name": "Quantum Mechanical Model of the Atom"
          },
          {
            "id": "g11-che-u2-s3",
            "name": "Electronic Configuration and Periodicity"
          }
        ]
      },
      {
        "id": "g11-che-u3",
        "name": "Chemical Bonding and Structure",
        "subUnits": [
          {
            "id": "g11-che-u3-s1",
            "name": "Ionic and Covalent Bonding"
          },
          {
            "id": "g11-che-u3-s2",
            "name": "VSEPR Theory and Molecular Geometry"
          },
          {
            "id": "g11-che-u3-s3",
            "name": "Intermolecular Forces"
          }
        ]
      },
      {
        "id": "g11-che-u4",
        "name": "Physical States of Matter",
        "subUnits": [
          {
            "id": "g11-che-u4-s1",
            "name": "Kinetic Molecular Theory"
          },
          {
            "id": "g11-che-u4-s2",
            "name": "Gas Laws and Ideal Gas Equation"
          },
          {
            "id": "g11-che-u4-s3",
            "name": "Properties of Liquids and Solids"
          }
        ]
      },
      {
        "id": "g11-che-u5",
        "name": "Chemical Kinetics",
        "subUnits": [
          {
            "id": "g11-che-u5-s1",
            "name": "Rate of Reaction"
          },
          {
            "id": "g11-che-u5-s2",
            "name": "Factors Affecting Reaction Rates"
          },
          {
            "id": "g11-che-u5-s3",
            "name": "Rate Laws and Collision Theory"
          }
        ]
      },
      {
        "id": "g11-che-u6",
        "name": "Chemical Equilibrium",
        "subUnits": [
          {
            "id": "g11-che-u6-s1",
            "name": "Concept of Dynamic Equilibrium"
          },
          {
            "id": "g11-che-u6-s2",
            "name": "Equilibrium Constant and Le Chatelier's Principle"
          },
          {
            "id": "g11-che-u6-s3",
            "name": "Phase Equilibrium"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-bio-nat",
    "name": "Biology",
    "icon": "Dna",
    "grade": "11",
    "stream": "Natural",
    "units": [
      {
        "id": "g11-bio-u1",
        "name": "The Science of Biology",
        "subUnits": [
          {
            "id": "g11-bio-u1-s1",
            "name": "Nature of Biological Science"
          },
          {
            "id": "g11-bio-u1-s2",
            "name": "Tools and Techniques in Biology"
          }
        ]
      },
      {
        "id": "g11-bio-u2",
        "name": "Biochemical Molecules",
        "subUnits": [
          {
            "id": "g11-bio-u2-s1",
            "name": "Inorganic and Organic Compounds"
          },
          {
            "id": "g11-bio-u2-s2",
            "name": "Carbohydrates, Lipids, Proteins and Nucleic Acids"
          }
        ]
      },
      {
        "id": "g11-bio-u3",
        "name": "Enzymes",
        "subUnits": [
          {
            "id": "g11-bio-u3-s1",
            "name": "Nature and Properties of Enzymes"
          },
          {
            "id": "g11-bio-u3-s2",
            "name": "Mechanism of Enzyme Action"
          },
          {
            "id": "g11-bio-u3-s3",
            "name": "Factors Affecting Enzyme Activity"
          }
        ]
      },
      {
        "id": "g11-bio-u4",
        "name": "Cell Biology",
        "subUnits": [
          {
            "id": "g11-bio-u4-s1",
            "name": "Cell Theory and Cell Structure"
          },
          {
            "id": "g11-bio-u4-s2",
            "name": "Cellular Organelles and their Functions"
          },
          {
            "id": "g11-bio-u4-s3",
            "name": "Transport Across Cell Membranes"
          }
        ]
      },
      {
        "id": "g11-bio-u5",
        "name": "Energy Transformation",
        "subUnits": [
          {
            "id": "g11-bio-u5-s1",
            "name": "Cellular Respiration"
          },
          {
            "id": "g11-bio-u5-s2",
            "name": "Photosynthesis"
          }
        ]
      },
      {
        "id": "g11-bio-u6",
        "name": "Human Anatomy and Physiology",
        "subUnits": [
          {
            "id": "g11-bio-u6-s1",
            "name": "Digestive and Respiratory Systems"
          },
          {
            "id": "g11-bio-u6-s2",
            "name": "Circulatory and Excretory Systems"
          },
          {
            "id": "g11-bio-u6-s3",
            "name": "Nervous and Endocrine Systems"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-math-soc",
    "name": "Mathematics",
    "icon": "Calculator",
    "grade": "11",
    "stream": "Social",
    "units": [
      {
        "id": "g11-math-soc-u1",
        "name": "Sequences and Series",
        "subUnits": [
          {
            "id": "g11-math-soc-u1-s1",
            "name": "Arithmetic Sequences and Series"
          },
          {
            "id": "g11-math-soc-u1-s2",
            "name": "Geometric Sequences and Series"
          },
          {
            "id": "g11-math-soc-u1-s3",
            "name": "Applications of Sequences and Series"
          }
        ]
      },
      {
        "id": "g11-math-soc-u2",
        "name": "Introduction to Calculus",
        "subUnits": [
          {
            "id": "g11-math-soc-u2-s1",
            "name": "Limits of Sequences and Functions"
          },
          {
            "id": "g11-math-soc-u2-s2",
            "name": "Continuity"
          },
          {
            "id": "g11-math-soc-u2-s3",
            "name": "Rates of Change"
          }
        ]
      },
      {
        "id": "g11-math-soc-u3",
        "name": "Statistics and Probability",
        "subUnits": [
          {
            "id": "g11-math-soc-u3-s1",
            "name": "Data Collection and Presentation"
          },
          {
            "id": "g11-math-soc-u3-s2",
            "name": "Measures of Central Tendency and Dispersion"
          },
          {
            "id": "g11-math-soc-u3-s3",
            "name": "Basic Concepts of Probability"
          }
        ]
      },
      {
        "id": "g11-math-soc-u4",
        "name": "Matrices and Determinants",
        "subUnits": [
          {
            "id": "g11-math-soc-u4-s1",
            "name": "Matrix Operations"
          },
          {
            "id": "g11-math-soc-u4-s2",
            "name": "Determinants and Inverses"
          },
          {
            "id": "g11-math-soc-u4-s3",
            "name": "Solving Systems of Linear Equations"
          }
        ]
      },
      {
        "id": "g11-math-soc-u5",
        "name": "Linear Programming",
        "subUnits": [
          {
            "id": "g11-math-soc-u5-s1",
            "name": "Linear Inequalities"
          },
          {
            "id": "g11-math-soc-u5-s2",
            "name": "Graphical Solutions of Linear Programming"
          },
          {
            "id": "g11-math-soc-u5-s3",
            "name": "Applications in Optimization"
          }
        ]
      },
      {
        "id": "g11-math-soc-u6",
        "name": "Mathematics in Business",
        "subUnits": [
          {
            "id": "g11-math-soc-u6-s1",
            "name": "Simple and Compound Interest"
          },
          {
            "id": "g11-math-soc-u6-s2",
            "name": "Annuities and Amortization"
          },
          {
            "id": "g11-math-soc-u6-s3",
            "name": "Depreciation"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-geo-soc",
    "name": "Geography",
    "icon": "Globe",
    "grade": "11",
    "stream": "Social",
    "units": [
      {
        "id": "g11-geo-u1",
        "name": "Map Reading and Interpretation",
        "subUnits": [
          {
            "id": "g11-geo-u1-s1",
            "name": "Topographic Maps and Relief Features"
          },
          {
            "id": "g11-geo-u1-s2",
            "name": "Drainage Patterns and Catchment Areas"
          },
          {
            "id": "g11-geo-u1-s3",
            "name": "Human Settlements on Maps"
          }
        ]
      },
      {
        "id": "g11-geo-u2",
        "name": "Physical Environment of the World and Africa",
        "subUnits": [
          {
            "id": "g11-geo-u2-s1",
            "name": "The Earth's Structure and Tectonic Plates"
          },
          {
            "id": "g11-geo-u2-s2",
            "name": "Global Climate Systems"
          },
          {
            "id": "g11-geo-u2-s3",
            "name": "Major Biomes of the World"
          }
        ]
      },
      {
        "id": "g11-geo-u3",
        "name": "Human Population and Demographic Characteristics",
        "subUnits": [
          {
            "id": "g11-geo-u3-s1",
            "name": "Population Dynamics and Growth Rates"
          },
          {
            "id": "g11-geo-u3-s2",
            "name": "Migration and Its Impacts"
          },
          {
            "id": "g11-geo-u3-s3",
            "name": "Population Policies"
          }
        ]
      },
      {
        "id": "g11-geo-u4",
        "name": "Economic Activities and Natural Resources",
        "subUnits": [
          {
            "id": "g11-geo-u4-s1",
            "name": "Agriculture and Food Security"
          },
          {
            "id": "g11-geo-u4-s2",
            "name": "Industrialization and Manufacturing"
          },
          {
            "id": "g11-geo-u4-s3",
            "name": "Sustainable Resource Management"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-his-soc",
    "name": "History",
    "icon": "Landmark",
    "grade": "11",
    "stream": "Social",
    "units": [
      {
        "id": "g11-his-u1",
        "name": "The Discipline of History and Human Evolution",
        "subUnits": [
          {
            "id": "g11-his-u1-s1",
            "name": "Historiography and Sources"
          },
          {
            "id": "g11-his-u1-s2",
            "name": "Theories of Human Evolution"
          },
          {
            "id": "g11-his-u1-s3",
            "name": "Stone Age Cultures"
          }
        ]
      },
      {
        "id": "g11-his-u2",
        "name": "Ancient World Civilizations",
        "subUnits": [
          {
            "id": "g11-his-u2-s1",
            "name": "Mesopotamia and Egypt"
          },
          {
            "id": "g11-his-u2-s2",
            "name": "Ancient Greece and Rome"
          },
          {
            "id": "g11-his-u2-s3",
            "name": "Ancient India and China"
          }
        ]
      },
      {
        "id": "g11-his-u3",
        "name": "Peoples and States in Ethiopia and the Horn to the end of 13th C",
        "subUnits": [
          {
            "id": "g11-his-u3-s1",
            "name": "Languages and Settlement Patterns"
          },
          {
            "id": "g11-his-u3-s2",
            "name": "Aksumite Empire"
          },
          {
            "id": "g11-his-u3-s3",
            "name": "Zagwe Dynasty"
          }
        ]
      },
      {
        "id": "g11-his-u4",
        "name": "The Middle Ages and Early Modern World",
        "subUnits": [
          {
            "id": "g11-his-u4-s1",
            "name": "Feudalism in Europe"
          },
          {
            "id": "g11-his-u4-s2",
            "name": "The Byzantine and Islamic Empires"
          },
          {
            "id": "g11-his-u4-s3",
            "name": "The Renaissance and Reformation"
          }
        ]
      },
      {
        "id": "g11-his-u5",
        "name": "Peoples and States of Africa to 1500",
        "subUnits": [
          {
            "id": "g11-his-u5-s1",
            "name": "Ancient African States"
          },
          {
            "id": "g11-his-u5-s2",
            "name": "Trans-Saharan Trade"
          },
          {
            "id": "g11-his-u5-s3",
            "name": "Spread of Islam in Africa"
          }
        ]
      },
      {
        "id": "g11-his-u6",
        "name": "Africa and the Outside World 1500-1880s",
        "subUnits": [
          {
            "id": "g11-his-u6-s1",
            "name": "European Contacts and the Slave Trade"
          },
          {
            "id": "g11-his-u6-s2",
            "name": "Legitimate Trade"
          },
          {
            "id": "g11-his-u6-s3",
            "name": "Pre-colonial African States"
          }
        ]
      },
      {
        "id": "g11-his-u7",
        "name": "State Formation in Ethiopia 13th-19th C",
        "subUnits": [
          {
            "id": "g11-his-u7-s1",
            "name": "The Solomonic Dynasty"
          },
          {
            "id": "g11-his-u7-s2",
            "name": "Muslim Sultanates and Oromo Population Movement"
          },
          {
            "id": "g11-his-u7-s3",
            "name": "Zemene Mesafint (Era of Princes)"
          }
        ]
      }
    ]
  },
  {
    "id": "g11-eco-soc",
    "name": "Economics",
    "icon": "TrendingUp",
    "grade": "11",
    "stream": "Social",
    "units": [
      {
        "id": "g11-eco-u1",
        "name": "Introduction to Macroeconomics",
        "subUnits": [
          {
            "id": "g11-eco-u1-s1",
            "name": "Microeconomics vs. Macroeconomics"
          },
          {
            "id": "g11-eco-u1-s2",
            "name": "Macroeconomic Goals and Instruments"
          }
        ]
      },
      {
        "id": "g11-eco-u2",
        "name": "National Income Accounting",
        "subUnits": [
          {
            "id": "g11-eco-u2-s1",
            "name": "GDP and GNP Concepts"
          },
          {
            "id": "g11-eco-u2-s2",
            "name": "Approaches to Measuring National Income"
          },
          {
            "id": "g11-eco-u2-s3",
            "name": "Real vs. Nominal GDP"
          }
        ]
      },
      {
        "id": "g11-eco-u3",
        "name": "Macroeconomic Problems",
        "subUnits": [
          {
            "id": "g11-eco-u3-s1",
            "name": "Unemployment: Types and Causes"
          },
          {
            "id": "g11-eco-u3-s2",
            "name": "Inflation: Causes and Consequences"
          },
          {
            "id": "g11-eco-u3-s3",
            "name": "Business Cycles"
          }
        ]
      },
      {
        "id": "g11-eco-u4",
        "name": "Macroeconomic Policy Instruments",
        "subUnits": [
          {
            "id": "g11-eco-u4-s1",
            "name": "Fiscal Policy"
          },
          {
            "id": "g11-eco-u4-s2",
            "name": "Monetary Policy"
          },
          {
            "id": "g11-eco-u4-s3",
            "name": "Income Policy"
          }
        ]
      },
      {
        "id": "g11-eco-u5",
        "name": "Money and Banking",
        "subUnits": [
          {
            "id": "g11-eco-u5-s1",
            "name": "Evolution and Functions of Money"
          },
          {
            "id": "g11-eco-u5-s2",
            "name": "Commercial Banks and Credit Creation"
          },
          {
            "id": "g11-eco-u5-s3",
            "name": "Central Bank Functions"
          }
        ]
      },
      {
        "id": "g11-eco-u6",
        "name": "Economic Development",
        "subUnits": [
          {
            "id": "g11-eco-u6-s1",
            "name": "Economic Growth vs. Economic Development"
          },
          {
            "id": "g11-eco-u6-s2",
            "name": "Indicators of Development"
          },
          {
            "id": "g11-eco-u6-s3",
            "name": "Challenges of Developing Countries"
          }
        ]
      }
    ]
  },
  {
    "id": "g12-math-nat",
    "name": "Mathematics",
    "icon": "Calculator",
    "grade": "12",
    "stream": "Natural",
    "units": [
      {
        "id": "g12-math-nat-u1",
        "name": "Sequences and Series",
        "subUnits": [
          {
            "id": "g12-math-nat-u1-s1",
            "name": "Sequences"
          },
          {
            "id": "g12-math-nat-u1-s2",
            "name": "Arithmetic and Geometric Sequences"
          },
          {
            "id": "g12-math-nat-u1-s3",
            "name": "The Sigma Notation and Partial Sums"
          },
          {
            "id": "g12-math-nat-u1-s4",
            "name": "Infinite Series"
          },
          {
            "id": "g12-math-nat-u1-s5",
            "name": "Applications of Progressions"
          }
        ]
      },
      {
        "id": "g12-math-nat-u2",
        "name": "Introduction to Limits and Continuity",
        "subUnits": [
          {
            "id": "g12-math-nat-u2-s1",
            "name": "Limits of Sequences of Numbers"
          },
          {
            "id": "g12-math-nat-u2-s2",
            "name": "Limits of Functions"
          },
          {
            "id": "g12-math-nat-u2-s3",
            "name": "Continuity of a Function"
          },
          {
            "id": "g12-math-nat-u2-s4",
            "name": "Applications of Limits"
          }
        ]
      },
      {
        "id": "g12-math-nat-u3",
        "name": "Introduction to Differential Calculus",
        "subUnits": [
          {
            "id": "g12-math-nat-u3-s1",
            "name": "Introduction to Derivatives"
          },
          {
            "id": "g12-math-nat-u3-s2",
            "name": "Derivatives of Some Functions"
          },
          {
            "id": "g12-math-nat-u3-s3",
            "name": "Derivatives of Combinations and Compositions"
          }
        ]
      },
      {
        "id": "g12-math-nat-u4",
        "name": "Applications of Differential Calculus",
        "subUnits": [
          {
            "id": "g12-math-nat-u4-s1",
            "name": "Extreme Values of Functions"
          },
          {
            "id": "g12-math-nat-u4-s2",
            "name": "The Mean Value Theorem"
          },
          {
            "id": "g12-math-nat-u4-s3",
            "name": "Curve Sketching"
          },
          {
            "id": "g12-math-nat-u4-s4",
            "name": "Optimization Problems"
          }
        ]
      },
      {
        "id": "g12-math-nat-u5",
        "name": "Introduction to Integral Calculus",
        "subUnits": [
          {
            "id": "g12-math-nat-u5-s1",
            "name": "Integration as Reverse Process of Differentiation"
          },
          {
            "id": "g12-math-nat-u5-s2",
            "name": "Techniques of Integration"
          },
          {
            "id": "g12-math-nat-u5-s3",
            "name": "Definite Integrals and Area"
          },
          {
            "id": "g12-math-nat-u5-s4",
            "name": "Applications of Integral Calculus"
          }
        ]
      },
      {
        "id": "g12-math-nat-u6",
        "name": "Three Dimensional Geometry and Vectors in Space",
        "subUnits": [
          {
            "id": "g12-math-nat-u6-s1",
            "name": "Coordinate Axes and Planes in Space"
          },
          {
            "id": "g12-math-nat-u6-s2",
            "name": "Distance and Mid-point Formulae in Space"
          },
          {
            "id": "g12-math-nat-u6-s3",
            "name": "Equation of a Sphere"
          },
          {
            "id": "g12-math-nat-u6-s4",
            "name": "Vectors in Space"
          },
          {
            "id": "g12-math-nat-u6-s5",
            "name": "Dot Product and Cross Product"
          }
        ]
      },
      {
        "id": "g12-math-nat-u7",
        "name": "Mathematical Proofs",
        "subUnits": [
          {
            "id": "g12-math-nat-u7-s1",
            "name": "Principles of Mathematical Induction"
          },
          {
            "id": "g12-math-nat-u7-s2",
            "name": "Methods of Direct and Indirect Proofs"
          }
        ]
      }
    ]
  },
  {
    "id": "g12-phy-nat",
    "name": "Physics",
    "icon": "Zap",
    "grade": "12",
    "stream": "Natural",
    "units": [
      {
        "id": "g12-phy-nat-u1",
        "name": "Thermodynamics",
        "subUnits": [
          {
            "id": "g12-phy-nat-u1-s1",
            "name": "Thermal Equilibrium and Temperature"
          },
          {
            "id": "g12-phy-nat-u1-s2",
            "name": "Work, Heat, and First Law"
          },
          {
            "id": "g12-phy-nat-u1-s3",
            "name": "Kinetic Theory of Gases"
          },
          {
            "id": "g12-phy-nat-u1-s4",
            "name": "Second Law, Efficiency, and Entropy"
          },
          {
            "id": "g12-phy-nat-u1-s5",
            "name": "Heat Engines and Refrigerators"
          }
        ]
      },
      {
        "id": "g12-phy-nat-u2",
        "name": "Oscillations and Waves",
        "subUnits": [
          {
            "id": "g12-phy-nat-u2-s1",
            "name": "Periodic Motion and SHM"
          },
          {
            "id": "g12-phy-nat-u2-s2",
            "name": "Wave Motion"
          },
          {
            "id": "g12-phy-nat-u2-s3",
            "name": "Sound, Loudness, and Human Ear"
          }
        ]
      },
      {
        "id": "g12-phy-nat-u3",
        "name": "Wave Optics",
        "subUnits": [
          {
            "id": "g12-phy-nat-u3-s1",
            "name": "Wave Fronts and Huygens's Principle"
          },
          {
            "id": "g12-phy-nat-u3-s2",
            "name": "Reflection and Refraction of Plane Waves"
          },
          {
            "id": "g12-phy-nat-u3-s3",
            "name": "Interference and Diffraction"
          }
        ]
      },
      {
        "id": "g12-phy-nat-u4",
        "name": "Electrostatics",
        "subUnits": [
          {
            "id": "g12-phy-nat-u4-s1",
            "name": "Coulomb's Law and Electric Fields"
          },
          {
            "id": "g12-phy-nat-u4-s2",
            "name": "Electric Potential"
          },
          {
            "id": "g12-phy-nat-u4-s3",
            "name": "Capacitors and Dielectrics"
          }
        ]
      },
      {
        "id": "g12-phy-nat-u5",
        "name": "Current Electricity",
        "subUnits": [
          {
            "id": "g12-phy-nat-u5-s1",
            "name": "Electric Current and Ohm's Law"
          },
          {
            "id": "g12-phy-nat-u5-s2",
            "name": "Kirchhoff's Laws"
          },
          {
            "id": "g12-phy-nat-u5-s3",
            "name": "EMF and Internal Resistance"
          }
        ]
      },
      {
        "id": "g12-phy-nat-u6",
        "name": "Magnetism",
        "subUnits": [
          {
            "id": "g12-phy-nat-u6-s1",
            "name": "Concepts of a Magnetic Field"
          },
          {
            "id": "g12-phy-nat-u6-s2",
            "name": "Motion of Charged Particles in Magnetic Fields"
          },
          {
            "id": "g12-phy-nat-u6-s3",
            "name": "Magnetic Force on Current-Carrying Conductors"
          },
          {
            "id": "g12-phy-nat-u6-s4",
            "name": "Ampere's Law"
          }
        ]
      },
      {
        "id": "g12-phy-nat-u7",
        "name": "Electromagnetic Induction and A.C. Circuits",
        "subUnits": [
          {
            "id": "g12-phy-nat-u7-s1",
            "name": "Phenomena of Electromagnetic Induction"
          },
          {
            "id": "g12-phy-nat-u7-s2",
            "name": "A.C. Generators and Transformers"
          },
          {
            "id": "g12-phy-nat-u7-s3",
            "name": "Alternating Currents"
          },
          {
            "id": "g12-phy-nat-u7-s4",
            "name": "Power in A.C. Circuits"
          }
        ]
      },
      {
        "id": "g12-phy-nat-u8",
        "name": "Atomic Physics",
        "subUnits": [
          {
            "id": "g12-phy-nat-u8-s1",
            "name": "Dual Nature of Matter and Radiation"
          },
          {
            "id": "g12-phy-nat-u8-s2",
            "name": "Atoms, Nuclei, and Radioactive Decay"
          }
        ]
      }
    ]
  },
  {
    "id": "g12-che-nat",
    "name": "Chemistry",
    "icon": "FlaskConical",
    "grade": "12",
    "stream": "Natural",
    "units": [
      {
        "id": "g12-che-nat-u1",
        "name": "Acid-Base Equilibria",
        "subUnits": [
          {
            "id": "g12-che-nat-u1-s1",
            "name": "Acid-Base Concepts"
          },
          {
            "id": "g12-che-nat-u1-s2",
            "name": "Ionic Equilibria of Weak Acids and Bases"
          },
          {
            "id": "g12-che-nat-u1-s3",
            "name": "Common Ion Effect and Buffer Solutions"
          },
          {
            "id": "g12-che-nat-u1-s4",
            "name": "Hydrolysis of Salts"
          },
          {
            "id": "g12-che-nat-u1-s5",
            "name": "Acid-Base Titrations and Indicators"
          }
        ]
      },
      {
        "id": "g12-che-nat-u2",
        "name": "Electrochemistry",
        "subUnits": [
          {
            "id": "g12-che-nat-u2-s1",
            "name": "Oxidation-Reduction Reactions"
          },
          {
            "id": "g12-che-nat-u2-s2",
            "name": "Galvanic (Voltaic) Cells"
          },
          {
            "id": "g12-che-nat-u2-s3",
            "name": "Cell Potential and Nernst Equation"
          },
          {
            "id": "g12-che-nat-u2-s4",
            "name": "Electrolytic Cells and Electrolysis"
          },
          {
            "id": "g12-che-nat-u2-s5",
            "name": "Industrial Applications and Corrosion"
          }
        ]
      },
      {
        "id": "g12-che-nat-u3",
        "name": "Industrial Chemistry",
        "subUnits": [
          {
            "id": "g12-che-nat-u3-s1",
            "name": "Introduction to Industrial Chemical Processes"
          },
          {
            "id": "g12-che-nat-u3-s2",
            "name": "Production of Ammonia and Nitric Acid"
          },
          {
            "id": "g12-che-nat-u3-s3",
            "name": "Production of Sulfuric Acid"
          },
          {
            "id": "g12-che-nat-u3-s4",
            "name": "Chemical Industries in Ethiopia"
          }
        ]
      },
      {
        "id": "g12-che-nat-u4",
        "name": "Polymers",
        "subUnits": [
          {
            "id": "g12-che-nat-u4-s1",
            "name": "Introduction to Polymers"
          },
          {
            "id": "g12-che-nat-u4-s2",
            "name": "Synthetic Polymers"
          },
          {
            "id": "g12-che-nat-u4-s3",
            "name": "Natural Polymers"
          }
        ]
      },
      {
        "id": "g12-che-nat-u5",
        "name": "Introduction to Environmental Chemistry",
        "subUnits": [
          {
            "id": "g12-che-nat-u5-s1",
            "name": "Atmospheric, Soil, and Water Chemistry"
          },
          {
            "id": "g12-che-nat-u5-s2",
            "name": "Environmental Pollution"
          },
          {
            "id": "g12-che-nat-u5-s3",
            "name": "Global Warming and Climate Change"
          },
          {
            "id": "g12-che-nat-u5-s4",
            "name": "Green Chemistry and Cleaner Production"
          }
        ]
      }
    ]
  },
  {
    "id": "g12-bio-nat",
    "name": "Biology",
    "icon": "Dna",
    "grade": "12",
    "stream": "Natural",
    "units": [
      {
        "id": "g12-bio-nat-u1",
        "name": "Micro-organisms",
        "subUnits": [
          {
            "id": "g12-bio-nat-u1-s1",
            "name": "Bacteria, Viruses, and Fungi Structure"
          },
          {
            "id": "g12-bio-nat-u1-s2",
            "name": "Micro-organisms in Industry"
          },
          {
            "id": "g12-bio-nat-u1-s3",
            "name": "Micro-organisms in Medicine"
          }
        ]
      },
      {
        "id": "g12-bio-nat-u2",
        "name": "Ecology and Ecosystems",
        "subUnits": [
          {
            "id": "g12-bio-nat-u2-s1",
            "name": "Biomes and Ecosystem Dynamics"
          },
          {
            "id": "g12-bio-nat-u2-s2",
            "name": "Population Dynamics"
          },
          {
            "id": "g12-bio-nat-u2-s3",
            "name": "Biodiversity Conservation in Ethiopia"
          }
        ]
      },
      {
        "id": "g12-bio-nat-u3",
        "name": "Genetics",
        "subUnits": [
          {
            "id": "g12-bio-nat-u3-s1",
            "name": "Mendelian Genetics"
          },
          {
            "id": "g12-bio-nat-u3-s2",
            "name": "Molecular Genetics"
          },
          {
            "id": "g12-bio-nat-u3-s3",
            "name": "Mutations and Genetic Engineering"
          }
        ]
      },
      {
        "id": "g12-bio-nat-u4",
        "name": "Evolution",
        "subUnits": [
          {
            "id": "g12-bio-nat-u4-s1",
            "name": "Evidence of Evolution"
          },
          {
            "id": "g12-bio-nat-u4-s2",
            "name": "Theories of Evolution"
          },
          {
            "id": "g12-bio-nat-u4-s3",
            "name": "Human Evolution"
          }
        ]
      }
    ]
  },
  {
    "id": "g12-math-soc",
    "name": "Mathematics",
    "icon": "Calculator",
    "grade": "12",
    "stream": "Social",
    "units": [
      {
        "id": "g12-math-soc-u1",
        "name": "Sequences and Series",
        "subUnits": [
          {
            "id": "g12-math-soc-u1-s1",
            "name": "Sequences"
          },
          {
            "id": "g12-math-soc-u1-s2",
            "name": "Arithmetic and Geometric Sequences"
          },
          {
            "id": "g12-math-soc-u1-s3",
            "name": "The Sigma Notation and Partial Sums"
          },
          {
            "id": "g12-math-soc-u1-s4",
            "name": "Infinite Series"
          },
          {
            "id": "g12-math-soc-u1-s5",
            "name": "Applications of Progressions"
          }
        ]
      },
      {
        "id": "g12-math-soc-u2",
        "name": "Introduction to Limits and Continuity",
        "subUnits": [
          {
            "id": "g12-math-soc-u2-s1",
            "name": "Limits of Sequences of Numbers"
          },
          {
            "id": "g12-math-soc-u2-s2",
            "name": "Limits of Functions"
          },
          {
            "id": "g12-math-soc-u2-s3",
            "name": "Continuity of a Function"
          }
        ]
      },
      {
        "id": "g12-math-soc-u3",
        "name": "Introduction to Differential Calculus",
        "subUnits": [
          {
            "id": "g12-math-soc-u3-s1",
            "name": "Introduction to Derivatives"
          },
          {
            "id": "g12-math-soc-u3-s2",
            "name": "Derivatives of Some Functions"
          },
          {
            "id": "g12-math-soc-u3-s3",
            "name": "Derivatives of Combinations and Compositions"
          }
        ]
      },
      {
        "id": "g12-math-soc-u4",
        "name": "Applications of Differential Calculus",
        "subUnits": [
          {
            "id": "g12-math-soc-u4-s1",
            "name": "Extreme Values of Functions"
          },
          {
            "id": "g12-math-soc-u4-s2",
            "name": "Curve Sketching"
          }
        ]
      },
      {
        "id": "g12-math-soc-u5",
        "name": "Introduction to Integral Calculus",
        "subUnits": [
          {
            "id": "g12-math-soc-u5-s1",
            "name": "Integration as Reverse Process of Differentiation"
          },
          {
            "id": "g12-math-soc-u5-s2",
            "name": "Definite Integrals and Area"
          }
        ]
      },
      {
        "id": "g12-math-soc-u8",
        "name": "Further on Statistics",
        "subUnits": [
          {
            "id": "g12-math-soc-u8-s1",
            "name": "Sampling Techniques"
          },
          {
            "id": "g12-math-soc-u8-s2",
            "name": "Representation and Interpretation of Data"
          },
          {
            "id": "g12-math-soc-u8-s3",
            "name": "Measures of Central Tendency and Variability"
          },
          {
            "id": "g12-math-soc-u8-s4",
            "name": "Use of Cumulative Frequency Curves"
          }
        ]
      },
      {
        "id": "g12-math-soc-u9",
        "name": "Application for Business and Consumers",
        "subUnits": [
          {
            "id": "g12-math-soc-u9-s1",
            "name": "Simple and Compound Interest"
          },
          {
            "id": "g12-math-soc-u9-s2",
            "name": "Depreciation and Taxation"
          },
          {
            "id": "g12-math-soc-u9-s3",
            "name": "Investment Portfolios"
          }
        ]
      }
    ]
  },
  {
    "id": "g12-geo-soc",
    "name": "Geography",
    "icon": "Globe",
    "grade": "12",
    "stream": "Social",
    "units": [
      {
        "id": "g12-geo-soc-u1",
        "name": "Map Reading and Interpretation",
        "subUnits": [
          {
            "id": "g12-geo-soc-u1-s1",
            "name": "Topographical Maps Interpretation"
          },
          {
            "id": "g12-geo-soc-u1-s2",
            "name": "Geospatial Technologies"
          }
        ]
      },
      {
        "id": "g12-geo-soc-u2",
        "name": "Physical Geography of Africa and Ethiopia",
        "subUnits": [
          {
            "id": "g12-geo-soc-u2-s1",
            "name": "Geological Structures and Landforms"
          },
          {
            "id": "g12-geo-soc-u2-s2",
            "name": "Climate and Drainage Systems"
          }
        ]
      }
    ]
  },
  {
    "id": "g12-eco-soc",
    "name": "Economics",
    "icon": "TrendingUp",
    "grade": "12",
    "stream": "Social",
    "units": [
      {
        "id": "g12-eco-soc-u1",
        "name": "Introduction to Macroeconomics",
        "subUnits": [
          {
            "id": "g12-eco-soc-u1-s1",
            "name": "Scope of Macroeconomics"
          },
          {
            "id": "g12-eco-soc-u1-s2",
            "name": "The Circular Flow of Income"
          }
        ]
      },
      {
        "id": "g12-eco-soc-u2",
        "name": "National Income Accounting",
        "subUnits": [
          {
            "id": "g12-eco-soc-u2-s1",
            "name": "GDP and GNP Metrics"
          },
          {
            "id": "g12-eco-soc-u2-s2",
            "name": "Nominal vs Real GDP"
          }
        ]
      }
    ]
  }
];
