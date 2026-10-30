/* =========================================================
   Cherry Kbeuty — DESCRIÇÕES DOS PRODUTOS
   Cada bloco usa o mesmo "id" do produto em js/produtos.js.

   resumo       parágrafo de abertura
   serve        "Para que serve?"
   beneficios   lista de "Principais benefícios"
   ativos       lista de [nome do ativo, explicação]
   tituloAtivos opcional — troca o título "Principais ativos"
   extra        opcional — { titulo, texto } (ex.: Tecnologia Boosting Shot)
   rotina       parágrafos de "Por que incluir na rotina?"
   importante   opcional — aviso de uso
   ========================================================= */

window.CHERRY_DESCRICOES = {

  /* ---------------- CELIMAX ---------------- */

  'celimax-noni-acne-cleanser': {
    resumo: 'O Celimax Noni The Real Acne Cleanser é um sabonete facial desenvolvido especialmente para peles oleosas e com tendência à acne, ajudando a fazer uma limpeza eficiente sem deixar a pele com aquela sensação excessivamente ressecada.',
    serve: 'Ajuda a remover oleosidade, impurezas e resíduos acumulados nos poros, deixando a pele limpa e preparada para receber os próximos produtos da rotina. É uma ótima opção para quem apresenta cravos, espinhas e excesso de oleosidade.',
    beneficios: [
      'Auxilia no controle da oleosidade',
      'Ajuda a manter os poros limpos e desobstruídos',
      'Contribui para prevenir o aparecimento de cravos e espinhas',
      'Remove impurezas e resíduos da pele',
      'Ajuda a acalmar a pele sensibilizada pela acne',
      'Limpa sem deixar uma sensação pesada de ressecamento',
    ],
    ativos: [
      ['Extrato de Noni', 'rico em compostos antioxidantes, ajuda a acalmar e cuidar da pele sensibilizada.'],
      ['Ácido Salicílico (BHA)', 'auxilia na limpeza dos poros e no controle da oleosidade, sendo um ativo muito utilizado em rotinas para cravos e acne.'],
    ],
    rotina: [
      'Uma boa rotina para acne começa pela limpeza. Quando oleosidade, resíduos e células mortas se acumulam nos poros, aumenta a chance de surgirem cravos e novas espinhas. Por isso, esse cleanser é uma excelente escolha para começar a rotina já tratando uma das principais necessidades da pele acneica.',
    ],
  },

  'celimax-pore-dark-spot-pads': {
    resumo: 'Os Pore + Dark Spot Brightening Pads da Celimax são discos de tratamento indicados principalmente para quem sofre com manchas, marcas de acne, excesso de oleosidade, textura irregular e poros aparentes.',
    serve: 'Ajuda a renovar suavemente a pele, controlar a oleosidade e melhorar gradualmente a aparência de manchas e marcas pós-acne. Com o uso contínuo, contribui para uma pele mais uniforme, lisa e iluminada.',
    beneficios: [
      'Auxilia no clareamento de manchas e marcas de acne',
      'Ajuda a melhorar a aparência dos poros',
      'Contribui para o controle da oleosidade',
      'Melhora a textura e as irregularidades da pele',
      'Ajuda a deixar o tom da pele mais uniforme',
      'Pads prontos para uso, tornando o tratamento mais prático',
    ],
    ativos: [
      ['Ácido Tranexâmico (TXA)', 'auxilia na redução da aparência de manchas e na uniformização do tom da pele.'],
      ['Niacinamida', 'ajuda no controle da oleosidade, na aparência dos poros e das manchas, além de fortalecer a barreira da pele.'],
      ['Complexo clareador', 'complementa a ação sobre manchas e ajuda a devolver luminosidade à pele.'],
    ],
    rotina: [
      'É uma ótima opção para quem percebe que, mesmo depois da acne melhorar, as marcas, os poros aparentes e a textura irregular continuam incomodando. Une vários benefícios em um único passo e torna o cuidado diário com manchas e poros muito mais prático.',
    ],
  },

  'celimax-retinal-shot': {
    resumo: 'O Celimax Retinal Shot Tightening Booster é um tratamento coreano antissinais de alta performance, desenvolvido principalmente para quem já percebe linhas finas, rugas mais marcadas, perda de firmeza, poros aparentes e textura irregular.',
    serve: 'Ajuda a acelerar a renovação da pele e melhorar gradualmente a aparência de rugas, linhas e perda de elasticidade, deixando a textura mais lisa, uniforme e com aparência rejuvenescida.',
    beneficios: [
      'Ajuda a suavizar linhas finas e rugas mais aparentes',
      'Contribui para melhorar firmeza e elasticidade',
      'Ajuda a melhorar a aparência dos poros',
      'Refina a textura irregular da pele',
      'Promove renovação da pele',
      'Auxilia na prevenção e tratamento dos sinais do envelhecimento',
      'Ideal para quem deseja intensificar uma rotina antissinais',
    ],
    ativos: [
      ['Retinal', 'derivado da vitamina A de alta performance, conhecido por atuar na renovação da pele e ajudar na melhora de rugas, linhas, firmeza e textura.'],
      ['Matrixyl', 'complexo de peptídeos que auxilia na aparência da firmeza, elasticidade e linhas.'],
      ['A-Shot', 'tecnologia da Celimax desenvolvida para potencializar a experiência e a entrega do tratamento na pele.'],
    ],
    rotina: [
      'Quando as linhas começam a ficar mais visíveis mesmo com o rosto relaxado, somente hidratação pode não ser suficiente. É nesse momento que tratamentos com vitamina A ganham importância, pois trabalham diretamente a renovação, textura e aparência dos sinais da idade.',
      'O Retinal Shot é uma excelente escolha para quem busca uma pele com aparência mais firme, lisa, uniforme e rejuvenescida.',
    ],
    importante: 'deve ser introduzido gradualmente e utilizado preferencialmente à noite. Durante o tratamento, o uso diário de protetor solar é indispensável.',
  },

  'celimax-vita-a-retinal-duo': {
    resumo: 'O Celimax Vita A Retinal Shot Duo é um tratamento coreano antissinais desenvolvido para quem busca melhorar rugas, linhas finas, perda de firmeza, poros aparentes e textura irregular. É ideal para quem deseja um cuidado mais completo com derivados da Vitamina A.',
    serve: 'Ajuda a acelerar a renovação da pele e melhorar gradualmente os sinais do envelhecimento, contribuindo para uma aparência mais lisa, firme, uniforme e rejuvenescida.',
    beneficios: [
      'Ajuda a suavizar linhas finas e rugas',
      'Contribui para melhorar firmeza e elasticidade',
      'Melhora a aparência dos poros dilatados',
      'Refina a textura áspera e irregular',
      'Auxilia na renovação da pele',
      'Ajuda a melhorar marcas e irregularidades',
      'Atua tanto na prevenção quanto no cuidado dos sinais já existentes',
    ],
    ativos: [
      ['Retinal', 'derivado avançado da Vitamina A que auxilia na renovação da pele e na melhora da aparência de rugas, linhas, textura e firmeza.'],
      ['Retinol', 'complementa o cuidado antissinais e ajuda a melhorar a renovação e a textura da pele.'],
      ['Peptídeos', 'auxiliam no cuidado da firmeza e elasticidade, complementando a ação dos retinoides.'],
    ],
    rotina: [
      'Com o passar do tempo, a renovação natural da pele diminui e começam a aparecer linhas mais marcadas, perda de firmeza, textura irregular e poros mais evidentes. Somente hidratar pode não ser suficiente para trabalhar todas essas alterações.',
      'O Vita A Retinal Shot Duo oferece um tratamento direcionado para renovação e antissinais, sendo uma excelente escolha para quem deseja uma pele com aparência mais firme, lisa, refinada e rejuvenescida.',
    ],
    importante: 'por conter derivados da Vitamina A, deve ser introduzido gradualmente e utilizado à noite. Evite combinar na mesma noite com outros retinoides ou ácidos esfoliantes fortes. O uso diário de protetor solar é indispensável.',
  },

  /* ---------------- NUMBUZIN ---------------- */

  'numbuzin-no5-glutathione': {
    resumo: 'A Numbuzin No.5 Glutathione TXA Ampoule é uma ampola coreana concentrada para quem sofre principalmente com manchas, marcas de acne, tom desigual e pele sem luminosidade.',
    serve: 'Atua diretamente no cuidado da aparência das manchas, ajudando a uniformizar o tom e devolver luminosidade. É especialmente interessante para aquelas marquinhas escuras que permanecem na pele mesmo depois que a acne desaparece.',
    beneficios: [
      'Auxilia no clareamento de manchas e marcas pós-acne',
      'Ajuda a uniformizar o tom da pele',
      'Melhora a aparência de áreas escurecidas',
      'Proporciona mais luminosidade e viço',
      'Combina diferentes ativos para potencializar o cuidado antimanchas',
    ],
    ativos: [
      ['Glutationa', 'poderoso antioxidante utilizado para ajudar na luminosidade e uniformização do tom da pele.'],
      ['Ácido Tranexâmico (TXA)', 'auxilia na redução da aparência de manchas e hiperpigmentação.'],
      ['Niacinamida', 'ajuda a uniformizar o tom, fortalecer a barreira da pele e melhorar a aparência das manchas.'],
    ],
    rotina: [
      'Nem sempre a acne termina quando a espinha desaparece. Muitas vezes ela deixa marcas escuras que podem permanecer por bastante tempo. Essa ampola é uma ótima opção para quem quer tratar justamente essa aparência irregular e conquistar uma pele mais uniforme, iluminada e com aspecto saudável.',
    ],
  },

  'numbuzin-no9-nad-sun': {
    resumo: 'O Numbuzin No.9 NAD Peptides Dewy Sun Essence é um protetor solar coreano com proposta antissinais, desenvolvido para quem deseja unir alta proteção solar, hidratação e cuidado com firmeza e elasticidade em um único produto.',
    serve: 'Protege diariamente contra os raios UVA e UVB, que estão entre os principais responsáveis pelo envelhecimento precoce, surgimento de manchas e perda de firmeza. Ao mesmo tempo, sua fórmula ajuda a manter a pele hidratada, viçosa e com aparência mais saudável.',
    beneficios: [
      'Alta proteção solar para uso diário',
      'Ajuda a prevenir manchas e o escurecimento das já existentes',
      'Auxilia na prevenção de linhas e sinais de fotoenvelhecimento',
      'Ajuda no cuidado da firmeza e elasticidade',
      'Proporciona hidratação e viço',
      'Acabamento de pele luminosa e saudável',
      'Une proteção solar e cuidado antissinais no mesmo passo',
    ],
    ativos: [
      ['NAD+', 'ingrediente utilizado na linha No.9 com foco em vitalidade e cuidado dos sinais de envelhecimento da pele.'],
      ['Peptídeos', 'auxiliam no cuidado da firmeza, elasticidade e aparência das linhas.'],
      ['Ingredientes hidratantes', 'ajudam a manter a pele confortável, hidratada e com aspecto mais preenchido.'],
      ['Filtros solares', 'oferecem proteção contra a radiação UVA e UVB.'],
    ],
    rotina: [
      'O sol é um dos maiores responsáveis pelo envelhecimento precoce da pele. Não adianta investir em séruns e cremes para rugas, flacidez e manchas sem protegê-la diariamente da radiação.',
      'O diferencial do No.9 Dewy Sun Essence é transformar o protetor solar em uma etapa de cuidado antissinais, sendo uma excelente escolha para quem busca uma pele protegida, hidratada, luminosa e com aparência mais jovem.',
    ],
  },

  /* ---------------- MEDICUBE ---------------- */

  'medicube-hypochlorous-spray': {
    resumo: 'O Medicube Hypochlorous Acid Daily Facial Spray é um spray facial coreano desenvolvido para ajudar no cuidado de peles sensibilizadas, irritadas, avermelhadas, oleosas ou com tendência à acne. É uma opção prática para usar no dia a dia quando a pele precisa de um cuidado calmante e refrescante.',
    serve: 'Ajuda a acalmar a pele e a manter uma condição mais equilibrada, sendo especialmente interessante para quem sofre com vermelhidão, sensibilidade e tendência ao aparecimento de espinhas.',
    beneficios: [
      'Ajuda a acalmar a pele sensibilizada',
      'Auxilia na redução da aparência de vermelhidão',
      'Interessante para peles oleosas e acneicas',
      'Ajuda no cuidado diário da pele propensa a imperfeições',
      'Proporciona sensação refrescante e confortável',
      'Formato em spray prático para aplicação ao longo do dia',
    ],
    tituloAtivos: 'Principal ativo',
    ativos: [
      ['Ácido Hipocloroso (HOCl)', 'substância conhecida por sua ação antimicrobiana e calmante, ajudando a cuidar da pele sensibilizada e a manter um ambiente mais equilibrado na superfície da pele.'],
    ],
    rotina: [
      'Quem tem pele acneica ou sensível muitas vezes pensa apenas em usar produtos fortes para tratar o problema, mas acalmar e preservar o equilíbrio da pele também é fundamental. Esse spray é uma alternativa prática para complementar a rotina, principalmente nos momentos em que a pele está mais sensibilizada, avermelhada ou propensa a novas imperfeições.',
    ],
  },

  'medicube-hyaluronic-capsule-cream': {
    resumo: 'O Medicube Hyaluronic Moist Capsule Cream é um hidratante coreano desenvolvido para quem sente a pele ressecada, desidratada, repuxando ou sem viço. Seu foco é devolver água e conforto à pele, deixando-a com aparência mais macia, saudável e preenchida.',
    serve: 'Ajuda a proporcionar hidratação intensa e duradoura, além de melhorar a retenção de água na pele. É especialmente interessante quando a pele apresenta linhas finas mais aparentes por causa da desidratação.',
    beneficios: [
      'Promove hidratação profunda',
      'Ajuda a evitar a perda de água da pele',
      'Melhora a aparência de linhas causadas pela desidratação',
      'Deixa a pele mais macia e com aparência preenchida',
      'Ajuda a recuperar o viço e a luminosidade natural',
      'Contribui para uma barreira cutânea mais saudável',
    ],
    ativos: [
      ['Ácido Hialurônico', 'atrai e retém água na pele, proporcionando hidratação e ajudando a deixar a aparência mais preenchida.'],
      ['Complexo de ingredientes hidratantes', 'auxilia na manutenção da umidade e no conforto da pele ao longo do dia.'],
    ],
    rotina: [
      'Uma pele desidratada pode ficar opaca, áspera, repuxando e até evidenciar mais as linhas finas. Por isso, não basta apenas usar ativos de tratamento: manter uma boa hidratação é essencial para a pele funcionar e ter uma aparência saudável.',
      'O Hyaluronic Moist Capsule Cream é ideal para quem busca aquele aspecto de pele hidratada, macia, viçosa e naturalmente preenchida.',
    ],
  },

  'medicube-zero-pore-pad': {
    resumo: 'O Medicube Zero Pore Pad é um dos produtos coreanos mais conhecidos para quem sofre com poros aparentes, excesso de oleosidade, cravos e textura irregular. São discos já embebidos em uma solução esfoliante, tornando o cuidado com os poros muito mais prático.',
    serve: 'Ajuda a remover células mortas e o excesso de oleosidade que se acumulam na superfície e dentro dos poros. Com o uso contínuo, contribui para uma pele com aparência mais lisa, uniforme e com poros menos evidentes.',
    beneficios: [
      'Ajuda a desobstruir e manter os poros limpos',
      'Reduz o acúmulo de oleosidade e células mortas',
      'Auxilia no cuidado de cravos e comedões',
      'Melhora a aparência dos poros dilatados',
      'Ajuda a controlar o excesso de oleosidade',
      'Melhora a textura áspera e irregular',
      'Deixa a pele mais lisa e preparada para os próximos produtos',
    ],
    ativos: [
      ['Ácido Lático (AHA)', 'promove uma esfoliação química na superfície da pele, ajudando na renovação e melhora da textura.'],
      ['Ácido Salicílico (BHA)', 'possui afinidade com a oleosidade e ajuda a limpar o interior dos poros, sendo especialmente interessante para cravos e pele oleosa.'],
      ['Ingredientes calmantes e hidratantes', 'ajudam a equilibrar a fórmula e proporcionar maior conforto durante o uso.'],
    ],
    rotina: [
      'Poros podem ficar muito mais aparentes quando existe acúmulo de oleosidade, células mortas e impurezas. Apenas lavar o rosto nem sempre é suficiente para realizar essa esfoliação. O Zero Pore Pad complementa a limpeza trabalhando justamente esse acúmulo.',
      'É uma excelente opção para quem busca uma pele com aparência mais lisa, limpa, uniforme e com poros menos aparentes.',
    ],
  },

  'medicube-collagen-glow-booster': {
    resumo: 'O Medicube Collagen Glow Booster Serum é um sérum coreano concentrado para quem busca uma pele com aparência mais firme, hidratada, preenchida e extremamente luminosa. É especialmente interessante para peles opacas, sem viço, desidratadas ou começando a apresentar perda de elasticidade.',
    serve: 'Ajuda a potencializar a hidratação e o famoso efeito “glass skin”, deixando a pele com aspecto mais viçoso e preenchido. Também complementa rotinas voltadas para firmeza e prevenção dos sinais de envelhecimento.',
    beneficios: [
      'Proporciona luminosidade e viço intenso',
      'Ajuda a deixar a pele com aparência mais preenchida',
      'Promove hidratação e maciez',
      'Contribui para firmeza e elasticidade',
      'Ajuda a suavizar visualmente linhas de desidratação',
      'Melhora a aparência de pele opaca e cansada',
      'Ideal para potencializar o efeito de pele saudável e radiante',
    ],
    ativos: [
      ['Colágeno', 'ajuda a hidratar e melhorar a aparência de elasticidade e preenchimento da pele.'],
      ['Niacinamida', 'contribui para luminosidade, uniformização do tom e fortalecimento da barreira cutânea.'],
      ['Ingredientes hidratantes e umectantes', 'ajudam a reter água e manter a pele macia, confortável e com mais viço.'],
    ],
    rotina: [
      'Nem sempre uma pele sem brilho precisa de um tratamento agressivo. Muitas vezes, a falta de luminosidade vem acompanhada de desidratação e perda daquele aspecto naturalmente preenchido. O Collagen Glow Booster Serum atua justamente nesse ponto, oferecendo um cuidado concentrado para recuperar o aspecto saudável e radiante.',
      'É uma ótima escolha para quem deseja uma pele com aparência mais hidratada, firme, preenchida e com efeito glow.',
    ],
  },

  'medicube-collagen-milk-wrapping-mask': {
    resumo: 'A Medicube Collagen Milk Toning Wrapping Mask é uma máscara coreana do tipo wrapping, que forma uma película sobre a pele para proporcionar um cuidado intensivo de hidratação, firmeza, elasticidade e luminosidade. É especialmente interessante para peles opacas, ressecadas, sem viço ou começando a apresentar sinais de envelhecimento.',
    serve: 'Cria uma camada de tratamento sobre a pele que ajuda a manter os ativos em contato durante o período de uso. Após a remoção, contribui para uma aparência mais hidratada, luminosa, uniforme e preenchida.',
    beneficios: [
      'Promove hidratação intensa',
      'Ajuda a melhorar firmeza e elasticidade',
      'Contribui para uma aparência mais preenchida',
      'Ajuda a melhorar o viço e a luminosidade',
      'Suaviza visualmente a aparência de linhas causadas pela desidratação',
      'Ajuda a deixar a textura mais macia e uniforme',
      'Proporciona aquele aspecto de pele saudável e bem cuidada',
    ],
    ativos: [
      ['Colágeno', 'ajuda na hidratação e proporciona uma aparência mais macia, firme e preenchida.'],
      ['Proteínas do leite', 'auxiliam na hidratação e condicionamento da pele, contribuindo para uma textura mais suave.'],
      ['Niacinamida', 'ajuda na luminosidade, uniformização do tom e fortalecimento da barreira cutânea.'],
    ],
    rotina: [
      'Quando a pele perde hidratação e elasticidade, ela pode ficar opaca, sem viço e com as linhas mais aparentes. A Collagen Milk Toning Wrapping Mask funciona como um tratamento complementar para aqueles momentos em que você deseja intensificar o cuidado e recuperar rapidamente a aparência de uma pele mais hidratada e radiante.',
      'É uma excelente opção para quem busca aquele efeito de pele mais luminosa, macia, viçosa e com aparência preenchida.',
    ],
  },

  'medicube-deep-vita-a-retinol': {
    resumo: 'O Medicube Deep Vita A Retinol Serum é um sérum coreano antissinais desenvolvido para quem deseja tratar linhas finas, rugas, perda de firmeza, poros aparentes e textura irregular. É uma ótima opção para quem busca uma pele com aparência mais lisa e renovada.',
    serve: 'Ajuda a acelerar a renovação da pele e melhorar gradualmente os principais sinais do envelhecimento. Com o uso contínuo, contribui para uma pele com textura mais uniforme, firme e aparência rejuvenescida.',
    beneficios: [
      'Auxilia na redução da aparência de linhas finas e rugas',
      'Ajuda a melhorar firmeza e elasticidade',
      'Melhora a textura irregular da pele',
      'Ajuda a suavizar a aparência dos poros',
      'Contribui para uma pele mais lisa e uniforme',
      'Atua na prevenção e no cuidado dos sinais de envelhecimento',
    ],
    ativos: [
      ['Retinol (Vitamina A)', 'um dos ativos mais conhecidos no cuidado antissinais. Estimula a renovação celular e auxilia na melhora da aparência de rugas, linhas, textura e firmeza.'],
      ['Retinal', 'derivado da vitamina A que complementa a ação renovadora e antissinais da fórmula.'],
      ['Niacinamida', 'auxilia no fortalecimento da barreira da pele, uniformização do tom e melhora da aparência dos poros.'],
    ],
    rotina: [
      'Com o passar do tempo, a renovação natural da pele fica mais lenta e começam a aparecer linhas, perda de firmeza, poros mais evidentes e textura irregular. Um tratamento com derivados da vitamina A atua justamente nesses sinais, tornando-se um dos passos mais importantes para quem busca uma rotina antissinais mais completa.',
    ],
    importante: 'por conter retinoides, deve ser introduzido gradualmente na rotina, preferencialmente à noite, com uso diário de protetor solar.',
  },

  'medicube-kojic-eye-gel': {
    resumo: 'O Medicube Kojic Acid Turmeric Vita Eye Gel Serum é um sérum em gel desenvolvido especialmente para quem se incomoda com olheiras de aparência escurecida, tom irregular e aspecto cansado ao redor dos olhos.',
    serve: 'Ajuda a iluminar e uniformizar a aparência da região dos olhos, atuando principalmente no aspecto escurecido e opaco. Também proporciona hidratação, deixando o olhar com aparência mais descansada e revitalizada.',
    beneficios: [
      'Ajuda a clarear a aparência de olheiras pigmentadas',
      'Contribui para uniformizar o tom ao redor dos olhos',
      'Melhora a luminosidade da região',
      'Ajuda a reduzir o aspecto cansado e opaco',
      'Hidrata a pele delicada da área dos olhos',
      'Textura em gel leve e confortável',
    ],
    ativos: [
      ['Ácido Kójico', 'conhecido por atuar na formação de pigmentação, ajudando a melhorar a aparência de áreas escurecidas.'],
      ['Cúrcuma (Turmeric)', 'possui ação antioxidante e ajuda a melhorar a luminosidade e a aparência da pele.'],
      ['Niacinamida', 'auxilia na uniformização do tom e no fortalecimento da barreira cutânea.'],
      ['Vitaminas e antioxidantes', 'complementam o cuidado da região, ajudando a proporcionar uma aparência mais iluminada e revitalizada.'],
    ],
    rotina: [
      'Nem toda olheira está relacionada apenas ao cansaço. Quando existe pigmentação e escurecimento da região, somente hidratar pode não ser suficiente. Esse sérum combina ativos voltados para luminosidade e uniformização, sendo uma ótima opção para quem deseja um olhar com aparência mais clara, iluminada e descansada.',
    ],
  },

  'medicube-pdrn-pink-capsule-cream': {
    resumo: 'O Medicube PDRN Pink Collagen Capsule Cream é um hidratante coreano voltado para firmeza, elasticidade, hidratação e revitalização da pele. É ideal para quem percebe a pele mais flácida, sem viço, ressecada ou começando a apresentar sinais de envelhecimento.',
    serve: 'Ajuda a melhorar a hidratação e a aparência da elasticidade da pele, proporcionando um aspecto mais firme, preenchido, luminoso e saudável.',
    beneficios: [
      'Ajuda a melhorar firmeza e elasticidade',
      'Promove hidratação e melhora o viço',
      'Contribui para uma aparência mais preenchida',
      'Auxilia no cuidado de linhas finas e sinais de envelhecimento',
      'Ajuda a fortalecer e revitalizar a aparência da pele',
      'Tecnologia em cápsulas que mistura os componentes no momento da aplicação',
    ],
    ativos: [
      ['PDRN', 'ingrediente muito utilizado nos cosméticos coreanos para revitalização, elasticidade e melhora da aparência geral da pele.'],
      ['Colágeno', 'auxilia na hidratação e proporciona uma aparência mais firme e preenchida.'],
      ['Niacinamida', 'ajuda a fortalecer a barreira da pele, melhorar a luminosidade e uniformizar o tom.'],
    ],
    rotina: [
      'Com o passar do tempo, a pele tende a perder hidratação, elasticidade e aquele aspecto mais preenchido e viçoso. Esse creme combina PDRN e colágeno justamente para quem quer que o hidratante faça mais do que apenas hidratar, acrescentando também um cuidado voltado para firmeza, revitalização e prevenção dos sinais da idade.',
    ],
  },

  'medicube-pdrn-volume-balm': {
    resumo: 'O Medicube PDRN Pink Collagen Volume Balm é um tratamento coreano em textura balm desenvolvido para quem busca melhorar a aparência de linhas finas, perda de firmeza, ressecamento e falta de viço. Sua proposta é proporcionar aquele aspecto de pele mais hidratada, luminosa e visualmente preenchida.',
    serve: 'Ajuda a hidratar intensamente e melhorar a aparência das áreas que apresentam linhas e perda de volume, deixando a pele com aspecto mais macio, firme e revitalizado. Pode ser aplicado de maneira direcionada nas regiões que precisam de maior cuidado.',
    beneficios: [
      'Ajuda a suavizar visualmente linhas finas',
      'Proporciona aparência mais preenchida e volumosa',
      'Ajuda no cuidado da firmeza e elasticidade',
      'Promove hidratação intensa',
      'Combate a aparência de pele ressecada e sem viço',
      'Proporciona luminosidade e efeito glow',
      'Prático para aplicar diretamente nas regiões desejadas',
    ],
    ativos: [
      ['PDRN', 'ingrediente muito utilizado no skincare coreano com foco em revitalização, elasticidade e melhora da aparência geral da pele.'],
      ['Colágeno', 'auxilia na hidratação e ajuda a proporcionar uma aparência mais macia e preenchida.'],
      ['Peptídeos', 'complementam o cuidado antissinais, auxiliando na aparência da firmeza e elasticidade.'],
    ],
    rotina: [
      'Algumas regiões do rosto começam a demonstrar o envelhecimento mais rapidamente, apresentando linhas, ressecamento e perda daquele aspecto naturalmente preenchido. Nesses casos, um produto direcionado permite reforçar o cuidado justamente onde a pele mais precisa.',
      'O PDRN Pink Collagen Volume Balm é uma excelente opção para quem busca uma pele com aparência mais preenchida, firme, hidratada e luminosa, podendo complementar facilmente uma rotina antissinais.',
    ],
  },

  'medicube-pdrn-pink-one-day-serum': {
    resumo: 'O Medicube PDRN Pink One Day Serum é um tratamento concentrado em doses individuais desenvolvido para quem busca melhorar firmeza, elasticidade, hidratação, textura e luminosidade da pele. Cada ampola vem com a quantidade ideal para manter o sérum protegido até o momento do uso.',
    serve: 'Ajuda a revitalizar a pele e melhorar sua aparência geral, sendo especialmente interessante para peles sem viço, desidratadas, com textura irregular ou começando a apresentar sinais de envelhecimento.',
    beneficios: [
      'Ajuda a melhorar firmeza e elasticidade',
      'Contribui para uma pele mais hidratada e viçosa',
      'Ajuda a melhorar a aparência da textura',
      'Proporciona aparência mais preenchida e revitalizada',
      'Auxilia no cuidado de linhas finas',
      'Doses individuais preservam melhor a fórmula e facilitam o uso',
    ],
    ativos: [
      ['PDRN', 'ativo muito utilizado no skincare coreano para revitalização e melhora da aparência da firmeza, elasticidade e qualidade geral da pele.'],
      ['Peptídeos', 'auxiliam no cuidado antissinais e ajudam a proporcionar uma aparência mais firme.'],
      ['Niacinamida', 'contribui para luminosidade, uniformização do tom e fortalecimento da barreira da pele.'],
    ],
    rotina: [
      'Quando a pele começa a apresentar menos viço, perda de elasticidade, textura irregular e linhas mais aparentes, somente hidratar pode não entregar o cuidado desejado. O PDRN Pink One Day Serum oferece um tratamento mais concentrado para quem busca uma pele com aparência mais firme, preenchida, luminosa e revitalizada.',
    ],
  },

  'medicube-red-foam-cleanser': {
    resumo: 'O Medicube Red Foam Cleanser é um sabonete facial desenvolvido especialmente para peles oleosas, acneicas e com tendência a cravos e espinhas. Ele proporciona uma limpeza profunda, ajudando a remover o excesso de oleosidade e as impurezas acumuladas ao longo do dia.',
    serve: 'Ajuda a manter a pele e os poros limpos, removendo oleosidade, resíduos e impurezas que podem contribuir para o aparecimento de cravos e espinhas.',
    beneficios: [
      'Auxilia no controle do excesso de oleosidade',
      'Promove uma limpeza eficiente dos poros',
      'Ajuda no cuidado de peles com cravos e espinhas',
      'Remove resíduos e impurezas acumuladas na pele',
      'Ajuda a deixar a pele limpa e preparada para os próximos produtos da rotina',
      'Embalagem de 230ml com excelente rendimento',
    ],
    ativos: [
      ['Ácido Salicílico (BHA)', 'ajuda a remover o excesso de oleosidade e células mortas acumuladas nos poros, sendo muito utilizado no cuidado da pele acneica.'],
      ['Complexo de ingredientes calmantes', 'auxilia no cuidado da pele sensibilizada e com tendência a vermelhidão causada pelas imperfeições.'],
    ],
    rotina: [
      'Para quem tem pele oleosa e acneica, apenas tratar a espinha depois que ela aparece pode não ser suficiente. Manter uma limpeza adequada dos poros e controlar o excesso de oleosidade é um dos primeiros passos para evitar o acúmulo de resíduos que favorece cravos e novas espinhas.',
    ],
  },

  'medicube-txa-niacinamide-cream': {
    resumo: 'O Medicube TXA + Niacinamide Capsule Cream é um creme coreano desenvolvido especialmente para quem sofre com manchas, marcas de acne, tom desigual e áreas escurecidas. Ele combina hidratação com ativos conhecidos pelo cuidado intensivo da hiperpigmentação.',
    serve: 'Ajuda a melhorar gradualmente a aparência das manchas e marcas pós-acne, deixando o tom da pele mais uniforme, iluminado e com aparência saudável.',
    beneficios: [
      'Auxilia no clareamento da aparência de manchas',
      'Ajuda a melhorar marcas escuras deixadas pela acne',
      'Contribui para uniformizar o tom da pele',
      'Proporciona hidratação e luminosidade',
      'Ajuda a fortalecer a barreira da pele',
      'Une tratamento antimanchas e hidratação em um único produto',
    ],
    ativos: [
      ['Ácido Tranexâmico (TXA)', 'ativo muito utilizado em tratamentos cosméticos para hiperpigmentação, ajudando a reduzir a aparência de manchas e áreas escurecidas.'],
      ['Niacinamida', 'auxilia na uniformização do tom, luminosidade, fortalecimento da barreira e controle da oleosidade.'],
      ['Alfa-Arbutin', 'complementa o tratamento clareador, ajudando a melhorar a aparência de manchas e o tom irregular.'],
    ],
    rotina: [
      'Quando as manchas já estão instaladas, apenas hidratar a pele pode não ser suficiente. O diferencial desse creme é combinar TXA + Niacinamida + Alfa-Arbutin, criando um cuidado direcionado para quem deseja tratar a aparência das manchas enquanto mantém a pele hidratada e saudável.',
      'É uma excelente opção para quem busca uma pele com aparência mais uniforme, iluminada e com menos marcas visíveis.',
    ],
  },

  /* ---------------- LILYEVE ---------------- */

  'lilyeve-grow-exosome': {
    resumo: 'O Lilyeve Grow Exosome Dual Serum é um sérum coreano desenvolvido especialmente para o cuidado das sobrancelhas, sendo indicado para quem possui fios finos, frágeis, enfraquecidos ou falhas que deixam a sobrancelha com aparência pouco preenchida.',
    serve: 'Ajuda a nutrir e fortalecer os fios das sobrancelhas, cuidando também da região onde eles nascem. Com o uso contínuo, contribui para sobrancelhas com aparência mais saudável, resistente e preenchida.',
    beneficios: [
      'Ajuda a fortalecer os fios das sobrancelhas',
      'Auxilia no cuidado de fios finos e enfraquecidos',
      'Contribui para melhorar a aparência de densidade',
      'Ajuda no cuidado de sobrancelhas com falhas',
      'Nutre e revitaliza a região dos fios',
      'Aplicação prática e direcionada',
      'Ideal para quem deseja recuperar a aparência de sobrancelhas mais cheias e definidas',
    ],
    ativos: [
      ['Exossomos', 'tecnologia utilizada em cosméticos avançados com foco em revitalização e cuidado da região onde os fios se desenvolvem.'],
      ['Complexo de ingredientes fortalecedores', 'auxilia na nutrição e manutenção dos fios, contribuindo para sobrancelhas com aparência mais forte e saudável.'],
    ],
    rotina: [
      'Com o tempo, excesso de retirada dos fios, procedimentos e outros fatores podem deixar as sobrancelhas mais finas, frágeis e com falhas aparentes. Apenas preencher com maquiagem disfarça o problema temporariamente; cuidar dos próprios fios ajuda a melhorar a aparência natural das sobrancelhas.',
      'O Lilyeve Grow Exosome Dual Serum é uma ótima opção para quem busca sobrancelhas com aparência mais preenchida, forte, saudável e bem definida.',
    ],
  },

  /* ---------------- SKIN1004 ---------------- */

  'skin1004-light-cleansing-oil': {
    resumo: 'O Skin1004 Madagascar Centella Light Cleansing Oil é um óleo de limpeza coreano leve, ideal para remover protetor solar, maquiagem, oleosidade e impurezas acumuladas nos poros. É o primeiro passo da dupla limpeza coreana e ajuda a deixar a pele realmente limpa sem aquela sensação de ressecamento.',
    serve: 'O óleo dissolve resíduos oleosos que nem sempre saem completamente apenas com sabonete facial, principalmente protetor solar resistente, maquiagem, sebo e resíduos acumulados ao longo do dia.',
    beneficios: [
      'Remove maquiagem e protetor solar com facilidade',
      'Dissolve excesso de oleosidade e impurezas',
      'Ajuda a limpar profundamente os poros',
      'Auxilia no cuidado de cravos e filamentos sebáceos',
      'Ajuda a prevenir o acúmulo de resíduos nos poros',
      'Limpa sem deixar a pele repuxando',
      'Textura leve que emulsiona em contato com a água',
      'Pode ser utilizado inclusive em peles oleosas',
    ],
    ativos: [
      ['Centella Asiática de Madagascar', 'conhecida por suas propriedades calmantes, ajudando a manter a pele confortável durante a limpeza.'],
      ['Óleo de Jojoba', 'ajuda a dissolver resíduos oleosos e contribui para uma limpeza confortável.'],
      ['Óleos vegetais', 'auxiliam na remoção de maquiagem, protetor solar e sebo sem necessidade de esfregar excessivamente a pele.'],
    ],
    rotina: [
      'Um dos erros mais comuns é acreditar que pele oleosa não pode usar cleansing oil. Na realidade, o óleo de limpeza é utilizado justamente para dissolver resíduos oleosos que ficam aderidos à pele.',
      'Para quem usa protetor solar todos os dias, ele faz ainda mais sentido: remove a camada acumulada antes do sabonete facial e ajuda a evitar que resíduos permaneçam nos poros.',
      // o texto enviado terminava cortado em "com menos poros c…" — revisar
      'É uma excelente opção para quem busca uma limpeza mais completa e uma pele com aparência mais limpa, macia e equilibrada.',
    ],
  },

  'skin1004-tone-brightening-gel-foam': {
    resumo: 'O Skin1004 Madagascar Centella Tone Brightening Cleansing Gel Foam é um sabonete facial coreano desenvolvido para quem busca uma limpeza eficiente enquanto cuida de manchas, marcas de acne, tom irregular e falta de luminosidade.',
    serve: 'Remove oleosidade, impurezas, resíduos de protetor solar e sujeiras acumuladas ao longo do dia, deixando a pele limpa e preparada para receber os produtos de tratamento. Ao mesmo tempo, complementa uma rotina voltada para uma pele mais uniforme e iluminada.',
    beneficios: [
      'Limpa a pele e remove o excesso de oleosidade',
      'Ajuda a remover células mortas e impurezas',
      'Complementa o cuidado de manchas e marcas pós-acne',
      'Ajuda a melhorar a aparência da pele opaca',
      'Contribui para uma textura mais lisa e uniforme',
      'Possui ação calmante graças à Centella',
      'Prepara a pele para séruns, ampolas e cremes de tratamento',
    ],
    ativos: [
      ['Centella Asiática de Madagascar', 'conhecida por sua ação calmante e por ajudar a manter a pele equilibrada durante a limpeza.'],
      ['Madecassoside', 'componente derivado da Centella que auxilia no cuidado de peles sensibilizadas e no fortalecimento da barreira cutânea.'],
      ['Ácidos esfoliantes suaves', 'ajudam na remoção de células mortas e contribuem para melhorar a textura e a luminosidade da pele.'],
    ],
    rotina: [
      'Uma rotina para manchas não começa apenas no sérum. Quando existe acúmulo de oleosidade, células mortas e resíduos, a pele pode ficar mais opaca, áspera e com textura irregular.',
      'O Tone Brightening Cleansing Gel Foam é uma ótima escolha para começar a rotina com uma limpeza que vai além de simplesmente retirar a sujeira, deixando a pele limpa, fresca, uniforme e preparada para receber os ativos antimanchas das próximas etapas.',
    ],
  },

  'skin1004-matrixyl': {
    resumo: 'A Skin1004 Madagascar Centella Matrixyl 10% Boosting Shot Ampoule é uma ampola coreana antissinais desenvolvida principalmente para quem se incomoda com linhas finas, rugas, perda de firmeza, elasticidade e textura irregular da pele.',
    serve: 'Ajuda a melhorar a aparência das linhas e rugas, enquanto contribui para uma pele mais firme, elástica e com aspecto preenchido. É uma excelente opção tanto para peles maduras quanto para quem deseja intensificar a prevenção dos sinais de envelhecimento.',
    beneficios: [
      'Ajuda a suavizar a aparência de linhas finas e rugas',
      'Contribui para melhorar firmeza e elasticidade',
      'Ajuda a deixar a pele com aparência mais preenchida',
      'Melhora a textura e o aspecto geral da pele',
      'Auxilia na prevenção dos sinais do envelhecimento',
      'Combina tratamento antissinais com o cuidado calmante da Centella',
    ],
    ativos: [
      ['Matrixyl 10%', 'complexo de peptídeos muito utilizado em cosméticos antissinais, que auxilia na melhora da aparência de rugas, firmeza e elasticidade da pele.'],
      ['Peptídeos', 'ajudam no cuidado da estrutura e sustentação da pele, contribuindo para uma aparência mais firme e rejuvenescida.'],
      ['Centella Asiática de Madagascar', 'ajuda a acalmar, hidratar e cuidar da barreira da pele.'],
    ],
    extra: {
      titulo: 'Tecnologia Boosting Shot',
      texto: 'A proposta da linha Boosting Shot é potencializar a entrega e o contato dos ativos com a pele, tornando o tratamento antissinais mais intensivo.',
    },
    rotina: [
      'Com o passar do tempo, a pele reduz naturalmente sua capacidade de manter firmeza, elasticidade e aparência preenchida, fazendo com que linhas e rugas fiquem mais evidentes. O Matrixyl é especialmente interessante para quem quer trabalhar esses sinais sem depender somente de retinol.',
      'É uma ótima escolha para quem busca uma pele com aparência mais firme, lisa, preenchida e rejuvenescida.',
    ],
  },

  'skin1004-poremizing': {
    resumo: 'A Skin1004 Madagascar Centella Poremizing Fresh Ampoule é uma ampola coreana desenvolvida principalmente para quem se incomoda com poros dilatados, excesso de oleosidade e textura irregular. Sua proposta é cuidar dos poros sem deixar a pele ressecada ou pesada.',
    serve: 'Ajuda a controlar o excesso de oleosidade e melhorar a aparência dos poros mais evidentes, enquanto proporciona hidratação leve e cuidado calmante. Com o uso contínuo, contribui para uma pele com textura mais lisa, equilibrada e uniforme.',
    beneficios: [
      'Ajuda a reduzir a aparência dos poros dilatados',
      'Contribui para o controle do excesso de oleosidade',
      'Ajuda a melhorar a textura irregular',
      'Promove hidratação leve sem pesar',
      'Ajuda a acalmar e equilibrar a pele',
      'Deixa a pele com aparência mais lisa e refinada',
      'Embalagem de 100ml com excelente rendimento',
    ],
    ativos: [
      ['Sal Rosa do Himalaia', 'rico em minerais e utilizado na linha Poremizing para auxiliar na limpeza e no cuidado dos poros.'],
      ['Centella Asiática de Madagascar', 'conhecida por sua ação calmante, ajudando a manter a pele equilibrada e confortável.'],
      ['Complexo de Peptídeos', 'auxilia no cuidado da elasticidade e firmeza, contribuindo para uma aparência mais refinada dos poros.'],
    ],
    rotina: [
      'Poros podem parecer maiores quando existe excesso de oleosidade, perda de elasticidade e textura irregular. Por isso, cuidar apenas da limpeza nem sempre é suficiente.',
      'A Poremizing Fresh Ampoule complementa esse cuidado oferecendo controle de oleosidade, hidratação e suporte à elasticidade, sendo uma excelente opção para quem busca uma pele com aparência mais lisa, equilibrada e com poros menos evidentes.',
    ],
  },

  'skin1004-retinol': {
    resumo: 'O Skin1004 Madagascar Centella Retinol 0,2% Boosting Shot é um tratamento coreano antissinais desenvolvido para quem deseja melhorar linhas finas, rugas, poros aparentes, textura irregular e perda de firmeza. Combina retinol com ingredientes calmantes para oferecer um cuidado renovador mais completo.',
    serve: 'Ajuda a estimular a renovação da pele e melhorar gradualmente sua textura, contribuindo para uma aparência mais lisa, firme, uniforme e rejuvenescida.',
    beneficios: [
      'Ajuda a suavizar a aparência de linhas finas e rugas',
      'Contribui para melhorar firmeza e elasticidade',
      'Ajuda a reduzir a aparência dos poros',
      'Melhora textura áspera e irregular',
      'Auxilia na renovação da pele',
      'Ajuda no cuidado de marcas e irregularidades',
      'Excelente para prevenção e tratamento dos sinais do envelhecimento',
    ],
    ativos: [
      ['Retinol 0,2%', 'derivado da vitamina A conhecido por estimular a renovação da pele e auxiliar na melhora de linhas, rugas, textura, firmeza e poros aparentes.'],
      ['Retinal', 'complementa o complexo de vitamina A e potencializa o cuidado renovador e antissinais.'],
      ['Centella Asiática de Madagascar', 'ajuda a acalmar e cuidar da barreira da pele durante o tratamento.'],
      ['Peptídeos', 'auxiliam no cuidado da firmeza e elasticidade.'],
    ],
    extra: {
      titulo: 'Tecnologia Boosting Shot',
      texto: 'Utiliza uma tecnologia de microspículas cosméticas que proporciona uma sensação característica de pequenos “microtoques” durante a aplicação e foi desenvolvida para potencializar a experiência de entrega dos ativos na pele.',
    },
    rotina: [
      'Quando começam a aparecer linhas, poros mais evidentes, perda de firmeza e textura irregular, somente hidratação pode não ser suficiente. O retinol é um dos ativos mais conhecidos para trabalhar vários desses sinais ao mesmo tempo.',
      'O Retinol 0,2% Boosting Shot é uma ótima opção para quem busca um tratamento mais completo para deixar a pele com aparência mais lisa, firme, uniforme e rejuvenescida.',
    ],
    importante: 'utilize à noite e introduza gradualmente, começando poucas vezes por semana. Evite combinar na mesma noite com outros retinoides ou ácidos esfoliantes fortes. O uso diário de protetor solar é indispensável.',
  },

  'skin1004-tea-trica-toner': {
    resumo: 'O Skin1004 Madagascar Centella Tea-Trica Purifying Toner é um tônico coreano desenvolvido especialmente para peles oleosas, acneicas e com tendência a cravos e espinhas. Ele ajuda a equilibrar a oleosidade enquanto acalma a pele e complementa o cuidado dos poros.',
    serve: 'Ajuda a controlar o excesso de oleosidade, remover resíduos que podem permanecer após a limpeza e manter os poros mais limpos. Também é uma ótima opção para quem apresenta vermelhidão e sensibilidade associadas às imperfeições.',
    beneficios: [
      'Ajuda a controlar o excesso de oleosidade',
      'Auxilia no cuidado de cravos e espinhas',
      'Ajuda a manter os poros limpos',
      'Contribui para uma pele mais equilibrada',
      'Acalma áreas sensibilizadas e avermelhadas',
      'Ajuda a melhorar a aparência da textura',
      'Prepara a pele para os próximos produtos da rotina',
    ],
    ativos: [
      ['Centella Asiática de Madagascar', 'conhecida por sua ação calmante, ajudando no cuidado da pele sensibilizada e avermelhada.'],
      ['Tea Tree', 'ingrediente muito utilizado em produtos para peles oleosas e acneicas, auxiliando no controle da oleosidade e no cuidado das imperfeições.'],
      ['Complexo Pine Tree', 'ingredientes derivados do pinheiro que complementam a ação purificante e calmante da linha Tea-Trica.'],
    ],
    // "Por que incluir na rotina?" chegou cortado — completar quando o texto for reenviado
  },

  /* ------- NOVOS DO CATÁLOGO EXPRESS (texto curto do PowerPoint) ------- */

  'medicube-kojic-pad-turmeric': {
    resumo: 'Pads com ácido kójico, cúrcuma e niacinamida. Clareiam marcas e uniformizam o tom da pele.',
  },

  'medicube-deep-vita-c-cream': {
    resumo: 'Creme com 50% de água de vitaminas e derivados de vitamina C. Ilumina a pele.',
  },

  'medicube-age-r-glutathione-cream': {
    resumo: 'Creme em cápsulas com glutationa. Dá viço e uniformiza o tom da pele.',
  },

  'celimax-pore-dark-spot-cream': {
    resumo: 'Creme clareador para poros e manchas. Refina a textura da pele.',
  },

  'skin1004-probio-cica-glow-sun': {
    resumo: 'Protetor solar em ampola com centella e probióticos, FPS50+ PA++++. Acabamento glow.',
  },

  'skin1004-probio-cica-intensive': {
    resumo: 'Ampola concentrada de centella com probióticos. Acalma e repara a pele.',
  },

  /* ---------------- K-SECRET ---------------- */

  'k-secret-seoul-1988-sun': {
    resumo: 'O K-Secret Seoul 1988 Sun Pine Tree + Ceramide é um protetor solar coreano de alta proteção que, além de proteger contra os danos solares, ajuda a acalmar, hidratar e fortalecer a barreira da pele. É uma ótima opção para quem busca proteção diária sem sensação pesada.',
    serve: 'Protege contra os raios UVA e UVB, responsáveis pelo envelhecimento precoce, escurecimento de manchas e diversos danos à pele. Ao mesmo tempo, oferece ativos que ajudam a manter a pele hidratada e equilibrada.',
    beneficios: [
      'Alta proteção FPS50+ PA++++',
      'Ajuda a prevenir o surgimento e o escurecimento de manchas',
      'Auxilia na prevenção do envelhecimento precoce causado pelo sol',
      'Ajuda a fortalecer a barreira da pele',
      'Proporciona hidratação e conforto',
      'Ajuda a acalmar a pele',
      'Textura leve e confortável para uso diário',
    ],
    ativos: [
      ['Extrato de Pinheiro (Pine Tree)', 'rico em compostos antioxidantes e calmantes, ajuda a proteger e cuidar da pele contra agressões externas.'],
      ['Ceramidas', 'fundamentais para uma barreira cutânea saudável, ajudam a evitar a perda de hidratação e deixam a pele mais resistente.'],
      ['Filtros solares de amplo espectro', 'oferecem alta proteção contra radiação UVA e UVB.'],
    ],
    rotina: [
      'Quem investe em produtos para manchas, acne ou antissinais precisa entender que o protetor solar é indispensável. Sem proteção adequada, o sol pode escurecer manchas existentes e acelerar o aparecimento de linhas e outros sinais da idade.',
      'O diferencial do Seoul 1988 Sun é oferecer proteção solar alta junto com cuidado de barreira e hidratação, sendo ideal para quem quer proteger a pele diariamente sem abrir mão do tratamento.',
    ],
  },

  'cosrx-oil-free-lotion': {
    resumo: 'Hidratação leve para ajudar a manter o conforto da pele sem uma sensação muito pesada. Com 70,8% de seiva de bétula.',
  },

  'etude-soon-jung-whip-cleanser': {
    resumo: 'Espuma de limpeza com pH 6,5, suave e de baixa irritação, da linha Soon Jung.',
  },

  'eucerin-dermopure-triple-serum': {
    resumo: 'Sérum facial de efeito triplo com 2% de ácido salicílico e Thiamidol.',
  },

  'cosrx-snail-92-cream': {
    resumo: 'Creme com 92% de filtrado de secreção de caracol (mucina). Ajuda a dar o brilho natural de uma pele saudável.',
  },

  'eucerin-aquaphor-pomada-kit': {
    resumo: 'Pomada reparadora para pele seca e extremamente seca. Kit com 2 bisnagas de 9 g cada.',
  },

  'boj-relief-sun-aqua-fresh': {
    resumo: 'Protetor solar FPS50+ PA++++ com arroz e B5, da linha Relief Sun Aqua-Fresh.',
  },

  'axis-y-dark-spot-serum': {
    resumo: 'Sérum com niacinamida 5% e esqualano vegetal. Ajuda a corrigir manchas e iluminar a pele, mantendo a hidratação.',
  },
};
