# ArenaX – Modern Debate Platform

ArenaX is a modern, animated, and beautiful debate platform for meaningful discussions. It features real-time debates, voting, leaderboards, content moderation, and a clean, responsive UI.

---

## 🚀 Features

- **User Authentication**: Secure signup, login, and session management.
- **Create & Join Debates**: Start new debates or join existing ones.
- **Live Debate Experience**: Real-time argument posting and voting.
- **Leaderboard**: See top debaters and trending topics.
- **Tags & Categories**: Organize and discover debates by topic.
- **Content Moderation**: Automatic detection of inappropriate language.
- **Responsive & Animated UI**: Beautiful, modern design with smooth animations.
- **Dark/Light Theme**: Toggle between system, dark, and light modes.
- **Public & Private Debate Views**: Share debates with public links.
- **Shareable Debates**: Easily share debates via social or copy link.
- **Accessible & SEO-friendly**: Built with accessibility and best practices in mind.

---

## 🛠️ Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/Nur-Adnan/programming-hero-task.git
cd arenax
```

### 2. **Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. **Set Up Environment Variables**

Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** You can generate a secret with `openssl rand -base64 32`.

### 4. **Run the Development Server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🏗️ How It Works

- **Authentication**: Uses NextAuth.js for secure login and session management.
- **Database**: MongoDB for storing users, debates, arguments, and votes.
- **UI/UX**: Built with Next.js App Router, Tailwind CSS, Framer Motion, and Radix UI for a modern, animated experience.
- **State Management**: Zustand for global state (user, debates, etc).
- **Content Moderation**: Arguments are checked for inappropriate language before posting.
- **Public Debates**: Share debates with anyone using a public link (e.g., `/debate/[id]/public`).
- **Leaderboard**: Ranks users based on debate participation and votes.

---

- **Themes**: Easily switch between dark, light, and system themes.
- **Animations**: Framer Motion powers smooth transitions and UI effects.
- **Extensible**: Add new debate categories, moderation rules, or features as needed.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/)

---

## Screenshots

<img 
  src="https://github.com/user-attachments/assets/6af1f7bd-1477-4157-854f-28a9331dc71e" 
  alt="landing-page" 
  class="w-full h-auto"
/>
<img width="1901" height="774" alt="image" src="https://github.com/user-attachments/assets/976c5d33-c2fd-409b-be21-208200e149fb" />
<img width="1920" height="1256" alt="shimmar-UI" src="https://github.com/user-attachments/assets/93bfdcff-0462-4c21-9513-b61c292c9cc0" />
<img width="1920" height="1797" alt="areax-2" src="https://github.com/user-attachments/assets/1f56d5aa-4b4c-4545-abfc-056b1b4d9aa1" />
