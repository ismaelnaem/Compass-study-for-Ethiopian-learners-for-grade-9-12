export interface TeacherInfo {
  name: string;
  avatarId: string;
  style: string;
  bio: string;
  color: string;
  langGreeting: {
    English: string;
    Amharic: string;
    Oromo: string;
  };
}

export const SUBJECT_TEACHERS: Record<string, TeacherInfo> = {
  Mathematics: {
    name: "Teacher Mufariat",
    avatarId: "alemu",
    style: "Strict but brilliant geometric & algebraic visualization",
    bio: "Rigorously explains mathematical proofs and formulas step-by-step using spatial models.",
    color: "from-blue-650 via-blue-700 to-indigo-800 text-blue-200 border-blue-500/30 glow-blue",
    langGreeting: {
      English: "I'm Teacher Mufariat. Let's conquer Mathematics logic together! [STAR]",
      Amharic: "እኔ መምህርት ሙፈሪያት ነኝ። የሂሳብ ፎርሙላዎችን በጋራ እናሸንፍ! [STAR]",
      Oromo: "Ani Barsiistuu Mufariyaati. Koo herrega haa mo'annu! [STAR]"
    }
  },
  Physics: {
    name: "Teacher Hanan",
    avatarId: "hana",
    style: "Direct, logical formulas breakdown and interactive physical models",
    bio: "Passionate about simplifying mechanical dynamics and quantum forces using everyday analogies.",
    color: "from-cyan-600 via-teal-650 to-emerald-700 text-cyan-200 border-cyan-500/30 glow-cyan",
    langGreeting: {
      English: "I'm Teacher Hanan. Physics laws governs our universe, let's explore them! [ROCKET]",
      Amharic: "እኔ መምህርት ሐናን ነኝ። የፊዚክስ ህግጋትን አብረን እንመርምር! [ROCKET]",
      Oromo: "Ani Barsiistuu Hannaani. Seera fiiziksii waliin haa qorannu! [ROCKET]"
    }
  },
  Biology: {
    name: "Teacher Tesfaye",
    avatarId: "tesfaye",
    style: "Fun, practical storytelling style and local ecosystem cases",
    bio: "Enjoys linking human anatomy and plant respiration directly to Ethiopian context.",
    color: "from-emerald-600 via-green-650 to-teal-700 text-emerald-255 border-emerald-500/30 glow-green",
    langGreeting: {
      English: "I'm Teacher Tesfaye. Let's delve into the mysteries of life and ecosystems! [BOOK]",
      Amharic: "እኔ መምህር ተስፋዬ ነኝ። የሕይወት እና የስነ-ምህዳር ሚስጥራትን እንመርምር! [BOOK]",
      Oromo: "Ani Barsiisaa Tasfaayeeti. Mirkaneessaa jireenyaa fi bishaan haa barannu! [BOOK]"
    }
  },
  Chemistry: {
    name: "Teacher Biruk",
    avatarId: "biruk",
    style: "Engaging molecular models and chemical property walkthroughs",
    bio: "Breathes life into molecular configurations and periodic reaction pathways.",
    color: "from-orange-650 via-amber-700 to-red-850 text-amber-200 border-amber-500/30 glow-amber",
    langGreeting: {
      English: "I'm Teacher Biruk. Let's discover the chemistry reactions of elements! [BRAIN]",
      Amharic: "እኔ መምህር ቢሩክ ነኝ። የኬሚስትሪ ውህዶችን አብረን እናጥና! [BRAIN]",
      Oromo: "Ani Barsiisaa Biiruki. Re'aksiyoonii keemistirii waliin haa hubannu! [BRAIN]"
    }
  },
  English: {
    name: "Teacher Nuri",
    avatarId: "ruth",
    style: "Patient grammar structures and conversational vocabulary learning",
    bio: "Empathetic guide focusing on language patterns, reading drills, and exam techniques.",
    color: "from-rose-600 via-pink-650 to-violet-750 text-rose-225 border-rose-500/30 glow-rose",
    langGreeting: {
      English: "I'm Teacher Nuri. I'm here to support your English grammar and reading fluency. [HEART]",
      Amharic: "እኔ መምህር ኑሪ ነኝ። በእንግሊዝኛ ሰዋስው እና ንባብ ልረዳዎት ዝግጁ ነኝ። [HEART]",
      Oromo: "Ani Barsiisaa Nuriiti. Afaan Ingiliffaa hubachuuf si gargaaruuf qophiidha. [HEART]"
    }
  },
  Geography: {
    name: "Teacher Wazir",
    avatarId: "dawit",
    style: "Vivid geographic mapping and local environmental examples",
    bio: "Unpacks topographic charts, agricultural distributions, and population grids visually.",
    color: "from-teal-600 via-cyan-700 to-emerald-800 text-teal-200 border-teal-500/30 glow-teal",
    langGreeting: {
      English: "I'm Teacher Wazir. Let's study maps, climates, and physical terrains together! [TARGET]",
      Amharic: "እኔ መምህር ወዚር ነኝ። ካርታዎችን እና የአየር ንብረትን በጋራ እናጥና! [TARGET]",
      Oromo: "Ani Barsiisaa Waziiri. Maappii fi qilleensa waliin haa qorannu! [TARGET]"
    }
  },
  History: {
    name: "Teacher Bekele",
    avatarId: "bekele",
    style: "Epic historical timelines and legendary timeline narration",
    bio: "Directly relates grand events, battles, and civilizations like an interactive cinematic story.",
    color: "from-red-650 via-rose-700 to-violet-850 text-rose-105 border-red-500/30 glow-red",
    langGreeting: {
      English: "I'm Teacher Bekele. Let's journey back to study ancient Ethiopian and world civilizations! [TROPHY]",
      Amharic: "እኔ መምህር በቀለ ነኝ። ጥንታዊ የኢትዮጵያ እና የአለም ስልጣኔዎችን ጉዞ እንጀምር! [TROPHY]",
      Oromo: "Ani Barsiisaa Baqqalaadha. Seenaa Itoophiyaa fi addunyaa waliin haa sakattaanu! [TROPHY]"
    }
  },
  ICT: {
    name: "Teacher Ismael",
    avatarId: "samuel",
    style: "Modern, code-driven, and practical computing lessons",
    bio: "Decodes binary operations, algorithms, database logic, and technology trends.",
    color: "from-violet-600 via-fuchsia-650 to-indigo-800 text-violet-200 border-violet-500/30 glow-violet",
    langGreeting: {
      English: "I'm Teacher Ismael. Let's master computing, codes, and database designs! [IDEA]",
      Amharic: "እኔ መምህር ኢስማኤል ነኝ። የኮምፒውተር ሳይንስ እና ቴክኖሎጂን አብረን እንማር! [IDEA]",
      Oromo: "Ani Barsiisaa Ismaa'eli. Saayinsii kompuyutaraa waliin haa barannu! [IDEA]"
    }
  },
  Economics: {
    name: "Teacher Aida",
    avatarId: "aida",
    style: "Analytical, focusing on micro and macro economic principles",
    bio: "Demystifies supply and demand, national markets, and global trade using real-world Ethiopian examples.",
    color: "from-blue-600 via-cyan-650 to-teal-800 text-blue-200 border-blue-500/30 glow-blue",
    langGreeting: {
      English: "I'm Teacher Aida. Ready to explore the principles of Economics and markets? [CHART]",
      Amharic: "እኔ መምህርት አኢዳ ነኝ። የኢኮኖሚክስ እና የገበያ መርሆዎችን ለማሰስ ዝግጁ ነዎት? [CHART]",
      Oromo: "Ani Barsiistuu Aayidaadha. Seera ikonomii fi gabaa qorachuuf qophiidhaa? [CHART]"
    }
  },
  Business: {
    name: "Teacher Dawit",
    avatarId: "dawit",
    style: "Practical, focusing on entrepreneurship and business management",
    bio: "Guides students through business planning, accounting basics, and entrepreneurial strategies.",
    color: "from-amber-600 via-orange-650 to-red-800 text-amber-200 border-amber-500/30 glow-amber",
    langGreeting: {
      English: "I'm Teacher Dawit. Let's learn about Business, entrepreneurship, and financial literacy! [BRIEFCASE]",
      Amharic: "እኔ መምህር ዳዊት ነኝ። ስለ ቢዝነስ እና የፋይናንስ እውቀት እንማር! [BRIEFCASE]",
      Oromo: "Ani Barsiisaa Daawwiti. Waa'ee daldalaa fi beekumsa faayinaansii haa barannu! [BRIEFCASE]"
    }
  },
  TechnicalDrawing: {
    name: "Teacher Yosef",
    avatarId: "yosef",
    style: "Precise, focusing on spatial geometry and engineering drafting",
    bio: "Helps students visualize and draft 3D objects, architectural plans, and engineering concepts.",
    color: "from-slate-600 via-gray-650 to-zinc-800 text-slate-200 border-slate-500/30 glow-slate",
    langGreeting: {
      English: "I'm Teacher Yosef. Let's sketch and draft exact Technical Drawings! [RULER]",
      Amharic: "እኔ መምህር ዮሴፍ ነኝ። ትክክለኛ የቴክኒክ ስዕሎችን እንሳል! [RULER]",
      Oromo: "Ani Barsiisaa Yooseefi. Fakkiiwwan teeknikaa sirritti haa kaafnu! [RULER]"
    }
  }
};

export const getTeacherForSubject = (subjectName: string): TeacherInfo => {
  const norm = subjectName.trim().toLowerCase();

  // Multilingual subject mapping
  if (norm.includes("math") || norm.includes("ሒሳብ") || norm.includes("herrega") || norm.includes("hisab")) {
    return SUBJECT_TEACHERS.Mathematics;
  }
  if (norm.includes("phys") || norm.includes("ፊዚክስ") || norm.includes("fiiziksii") || norm.includes("fiziks")) {
    return SUBJECT_TEACHERS.Physics;
  }
  if (norm.includes("biol") || norm.includes("ባዮሎጂ") || norm.includes("baayoloojii") || norm.includes("bioloojii") || norm.includes("bayoloji")) {
    return SUBJECT_TEACHERS.Biology;
  }
  if (norm.includes("chem") || norm.includes("ኬሚስትሪ") || norm.includes("keemistrii") || norm.includes("kemistri")) {
    return SUBJECT_TEACHERS.Chemistry;
  }
  if (norm.includes("engl") || norm.includes("እንግሊዝኛ") || norm.includes("ingiliffa") || norm.includes("english")) {
    return SUBJECT_TEACHERS.English;
  }
  if (norm.includes("geog") || norm.includes("ጂኦግራፊ") || norm.includes("jiyoogiraafii") || norm.includes("geografi")) {
    return SUBJECT_TEACHERS.Geography;
  }
  if (norm.includes("hist") || norm.includes("ታሪክ") || norm.includes("seenaa") || norm.includes("tarik")) {
    return SUBJECT_TEACHERS.History;
  }
  if (norm.includes("ict") || norm.includes("አይሲቲ") || norm.includes("kompuyutara") || norm.includes("saayinsii") || norm.includes("computing") || norm.includes("information")) {
    return SUBJECT_TEACHERS.ICT;
  }
  if (norm.includes("econ") || norm.includes("ኢኮኖሚክስ") || norm.includes("dinagdee") || norm.includes("ikonomii")) {
    return SUBJECT_TEACHERS.Economics;
  }
  if (norm.includes("busin") || norm.includes("ንግድ") || norm.includes("daldala") || norm.includes("bizinasii")) {
    return SUBJECT_TEACHERS.Business;
  }
  if (norm.includes("draw") || norm.includes("draft") || norm.includes("ስዕል") || norm.includes("fakkii")) {
    return SUBJECT_TEACHERS.TechnicalDrawing;
  }

  for (const key of Object.keys(SUBJECT_TEACHERS)) {
    if (norm.includes(key.toLowerCase()) || key.toLowerCase().includes(norm)) {
      return SUBJECT_TEACHERS[key];
    }
  }
  // Default teacher fallback (Generic)
  return {
    name: "your subject teacher",
    avatarId: "generic",
    style: "Curriculum aligned step-by-step guidance",
    bio: "Your expert school syllabus guide supporting you on every unit of the Ethiopian curriculum.",
    color: "from-slate-650 via-slate-700 to-indigo-850 text-slate-200 border-slate-500/30 glow-slate",
    langGreeting: {
      English: "I'm your subject teacher. Let's master your school syllabus today! [STAR]",
      Amharic: "እኔ የትምህርት ረዳትዎ ነኝ። ዛሬ የትምህርት ካርታዎን እንረዳ! [STAR]",
      Oromo: "Ani gargaaraa barumsa keetiiti. Har'a milkaa'ina keetiif haa hojjennu! [STAR]"
    }
  };
};

export const getTeacherNameInitial = (name: string): string => {
  const p = name.replace("Teacher ", "");
  return p.charAt(0).toUpperCase();
};
