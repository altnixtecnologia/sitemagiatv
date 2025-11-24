# MagiaTV - Portal de Entretenimento

## 📺 Visão Geral
O MagiaTV é um site moderno e atrativo para serviços de streaming de TV, criado com HTML, CSS e JavaScript puro. O site apresenta um design responsivo com foco em filmes lançamentos, jogos de futebol ao vivo e integração com WhatsApp para contato direto.

## ✨ Funcionalidades Implementadas

### 🎯 Página Principal
- **Hero Section** com gradiente atraente e call-to-actions claros
- **Menu de navegação** responsivo com mobile menu toggle
- **Animações suaves** ao fazer scroll na página
- **Design moderno** usando Tailwind CSS
- **Logo aprimorada** com ícone de TV e efeito de pulsação

### 🎬 Seção de Destaques
- **Cards de filmes** com diferentes categorias (Ação, Comédia, Aventura, Suspense)
- **Trailers do YouTube** - Botão "Ver Trailer" que abre vídeos em modal
- **Jogos de futebol ao vivo** com brasões/coloração dos times
- **Efeitos hover** nos cards com elevação e sombras
- **Badges indicativas** (NOVO, LANÇAMENTO, PREMIUM, EXCLUSIVO)

### ⚽ Jogos de Futebol
- **Integração com API TheSportsDB** para jogos do dia
- **Atualização automática** a cada 30 minutos
- **Brasões dos times** com representações visuais reais:
  - Palmeiras: Escudo verde com detalhes em branco
  - Santos: Escudo branco com detalhes em preto  
  - Flamengo: Escudo vermelho com detalhes em preto
  - Fluminense: Escudo com vermelho e verde
  - Corinthians: Escudo preto com detalhes em branco
  - São Paulo: Escudo vermelho com detalhes em branco
- **Imagens SVG** dos escudos oficiais dos times
- **Status ao vivo** com indicador visual pulsante
- **Fallback para jogos estáticos** quando API indisponível
- **Botões "Ver Jogo"** que abrem vídeos de partidas no YouTube
- **Horários e competições** detalhadas

### 💰 Planos e Preços
- **Três planos diferenciados**: Básico (R$ 29/mês), Intermediário (R$ 49/mês), Premium (R$ 79/mês)
- **Cards destacados** com plano intermediário marcado como "MAIS POPULAR"
- **Botões de ação** para contratação via WhatsApp
- **Recursos detalhados** por plano

### 📱 Integração WhatsApp
- **Formulário de contato** com campos de nome, telefone, plano de interesse e mensagem
- **Máscara de telefone** automática (00) 00000-0000
- **Botão flutuante** do WhatsApp no canto inferior direito
- **Botões em cards** de planos que abrem WhatsApp com mensagem pré-formatada

### 🎬 Vídeos do YouTube
- **Modal de vídeo** que abre trailers de filmes
- **Vídeos de jogos de futebol** com partidas ao vivo
- **Player integrado** com YouTube Embed API
- **Controles de vídeo** (play, pause, fullscreen)
- **Fechamento com ESC** ou clicando fora do modal

### 🎨 Características Visuais
- **Gradientes modernos** no background
- **Animações de entrada** suaves para elementos
- **Ícones Font Awesome** para melhor visualização
- **Tipografia Inter** do Google Fonts
- **Design responsivo** para todos os dispositivos
- **Logo personalizada** com tema mágico e místico
- **Tema de cores** adaptado para combinar com a identidade visual da logo
- **Brasões de times reais** em SVG para futebol
- **Indicador de atualização** com data/hora

### 💰 Planos e Preços
- **Três planos diferenciados**: Básico (R$ 29/mês), Intermediário (R$ 49/mês), Premium (R$ 79/mês)
- **Cards destacados** com plano intermediário marcado como "MAIS POPULAR"
- **Botões de ação** para contratação via WhatsApp
- **Recursos detalhados** por plano

### 📱 Integração WhatsApp
- **Formulário de contato** com campos de nome, telefone, plano de interesse e mensagem
- **Máscara de telefone** automática (00) 00000-0000
- **Botão flutuante** do WhatsApp no canto inferior direito
- **Botões em cards** de planos que abrem WhatsApp com mensagem pré-formatada

### 🎨 Características Visuais
- **Gradientes modernos** no background
- **Animações de entrada** suaves para elementos
- **Ícones Font Awesome** para melhor visualização
- **Tipografia Inter** do Google Fonts
- **Design responsivo** para todos os dispositivos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **Tailwind CSS** - Framework CSS via CDN
- **JavaScript Vanilla** - Interatividade
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia
- **YouTube Embed API** - Vídeos de trailers e jogos
- **Logo personalizada** hospedada no Supabase Storage

### Funcionalidades JavaScript
- **Menu mobile** com animações
- **Scroll suave** entre seções
- **Animações ao scroll** (fade-in, slide-in)
- **Validação de formulários**
- **Integração com WhatsApp API**
- **Player de vídeo modal** com YouTube
- **Gestão de vídeos** (abrir, fechar, autoplay)

## 📁 Estrutura de Arquivos

```
/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos personalizados e animações
└── js/
    └── main.js        # Funcionalidades JavaScript
```

## 🚀 Como Usar

### Configuração do WhatsApp
1. Abra o arquivo `js/main.js`
2. Localize a constante `WHATSAPP_NUMBER`
3. Substitua pelo número real do WhatsApp (formato internacional, ex: 5511999999999)

### Personalização
- **Cores**: Modifique as classes do Tailwind CSS no HTML
- **Conteúdo**: Atualize os textos diretamente no HTML
- **Imagens**: Substitua os placeholders por imagens reais
- **Preços**: Altere os valores na seção de planos

## 🎯 URLs e Funcionalidades

### Links Internos
- `#destaques` - Seção de filmes e jogos
- `#planos` - Tabela de preços
- `#contato` - Formulário de contato

### Botões de Ação
- **Ver Demonstração** - Inicia demonstração (placeholder)
- **Fale Conosco** - Abre formulário de contato
- **Contratar via WhatsApp** - Abre WhatsApp com mensagem pré-formatada

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- **Desktop** (1920px+)
- **Tablet** (768px - 1024px)
- **Mobile** (320px - 767px)

## 🎨 Personalização de Estilos

### Cores Principais
- **Azul Primário**: `#667eea` (gradiente)
- **Roxo Secundário**: `#764ba2` (gradiente)
- **WhatsApp**: `#25D366`

### Animações
- **Fade In Up**: Elementos surgem de baixo para cima
- **Slide In**: Elementos deslizam dos lados
- **Zoom In**: Elementos aumentam de tamanho
- **Pulse**: Efeito de pulsação suave

## 🔧 Funcionalidades JavaScript

### FormHandler
- Validação de campos obrigatórios
- Formatação automática de telefone
- Envio de mensagem via WhatsApp

### ScrollHandler
- Animações ao scroll
- Scroll suave entre seções
- Efeitos de parallax no hero

### MobileHandler
- Menu mobile toggle
- Responsividade completa
- Touch-friendly

## 📊 Melhorias Futuras Recomendadas

### Funcionalidades
- [ ] Vídeos de trailers - Modal com player do YouTube
- [ ] Brasões de times - Representações visuais dos clubes
- [ ] Player de vídeo modal - Experiência cinematográfica
- [ ] Integração YouTube - Trailers e jogos ao vivo
- [ ] Logo aprimorada - Ícone de TV com efeitos visuais
- [ ] Mais times brasileiros - Brasões coloridos e realistas
- [ ] Sistema de pagamento online
- [ ] Área de login para clientes
- [ ] Blog com notícias de entretenimento

### Design
- [ ] Adicionar mais imagens reais
- [ ] Implementar modo escuro
- [ ] Adicionar mais animações
- [ ] Criar landing pages específicas por plano

### Performance
- [ ] Otimizar imagens
- [ ] Implementar lazy loading
- [ ] Adicionar PWA capabilities
- [ ] Implementar SEO avançado

## 🎬 Demonstração

O site apresenta:
- **Hero section** com call-to-action atrativo e logo aprimorada
- **Cards de filmes** com diferentes categorias e botões "Ver Trailer"
- **Jogos de futebol** com brasões dos times e botões "Ver Jogo"
- **Planos de assinatura** com preços claros
- **Formulário de contato** integrado com WhatsApp
- **Vídeos do YouTube** em modal para trailers e jogos
- **Player de vídeo integrado** com controles completos

## 📞 Contato

Para dúvidas e suporte, acesse a seção de contato no site ou clique no botão flutuante do WhatsApp.

---

**⚡ Desenvolvido com tecnologias modernas para melhor experiência do usuário**