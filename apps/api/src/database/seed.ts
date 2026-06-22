import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { Comment } from '../posts/entities/comment.entity';
import { PostLike } from '../posts/entities/post-like.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { AppDataSource } from './data-source';

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const SAMPLE_THUMB =
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=60';

interface SeedPost {
  title: string;
  description: string;
  content: string;
  tags: string[];
  thumbnailUrl: string | null;
}

const POSTS: SeedPost[] = [
  {
    title: 'Componentes acessíveis com React',
    description:
      'Como construir botões e formulários acessíveis usando ARIA e foco gerenciado no React.',
    content:
      'function Button({ children, ...props }) {\n  return (\n    <button className="btn" {...props}>\n      {children}\n    </button>\n  );\n}',
    tags: ['React', 'Acessibilidade', 'Front-end'],
    thumbnailUrl: SAMPLE_THUMB,
  },
  {
    title: 'Hooks customizados que você vai usar todo dia',
    description:
      'useDebounce, usePrevious e useLocalStorage explicados com exemplos práticos.',
    content:
      'function useDebounce(value, delay) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}',
    tags: ['React', 'Hooks', 'Front-end'],
    thumbnailUrl: null,
  },
  {
    title: 'Full-text search no PostgreSQL',
    description:
      'Indexando texto com tsvector e GIN para buscas rápidas e relevantes.',
    content:
      "ALTER TABLE posts ADD COLUMN search_vector tsvector\n  GENERATED ALWAYS AS (to_tsvector('portuguese', title)) STORED;\nCREATE INDEX ON posts USING GIN (search_vector);",
    tags: ['Postgres', 'Backend', 'SQL'],
    thumbnailUrl: SAMPLE_THUMB,
  },
  {
    title: 'Autenticação JWT com NestJS',
    description:
      'Protegendo rotas com guards e estratégias de token de forma simples.',
    content:
      "@UseGuards(AuthGuard)\n@Get('me')\nme(@Req() req) {\n  return req.user;\n}",
    tags: ['NestJS', 'Backend', 'Node'],
    thumbnailUrl: null,
  },
  {
    title: 'CSS Grid na prática',
    description: 'Layouts responsivos sem media queries usando grid moderno.',
    content:
      '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 24px;\n}',
    tags: ['CSS', 'Front-end'],
    thumbnailUrl: SAMPLE_THUMB,
  },
  {
    title: 'Testes de componentes com Testing Library',
    description:
      'Escrevendo testes focados no comportamento do usuário, não na implementação.',
    content:
      "render(<Button>Login</Button>);\nexpect(screen.getByRole('button')).toHaveTextContent('Login');",
    tags: ['Testes', 'React', 'Front-end'],
    thumbnailUrl: null,
  },
  {
    title: 'TypeScript: tipos utilitários essenciais',
    description:
      'Partial, Pick, Omit e Record para deixar seu código mais seguro.',
    content:
      "type PublicUser = Omit<User, 'passwordHash'>;\ntype Draft = Partial<Post>;",
    tags: ['TypeScript', 'Front-end', 'Backend'],
    thumbnailUrl: SAMPLE_THUMB,
  },
  {
    title: 'Docker Compose para desenvolvimento',
    description:
      'Subindo banco de dados e serviços locais com um único comando.',
    content:
      'services:\n  db:\n    image: postgres:16-alpine\n    ports:\n      - "5432:5432"',
    tags: ['Docker', 'DevOps', 'Backend'],
    thumbnailUrl: null,
  },
  {
    title: 'Boas práticas de REST API',
    description: 'Recursos, verbos e status codes usados da forma correta.',
    content:
      'GET /posts        // lista\nPOST /posts       // cria\nGET /posts/:id    // detalhe',
    tags: ['API', 'Backend'],
    thumbnailUrl: SAMPLE_THUMB,
  },
  {
    title: 'Gerenciando estado com Context API',
    description:
      'Quando usar Context e como evitar re-renderizações desnecessárias.',
    content:
      'const SessionContext = createContext(null);\nexport const useSession = () => useContext(SessionContext);',
    tags: ['React', 'Front-end'],
    thumbnailUrl: null,
  },
  {
    title: 'Migrations com TypeORM',
    description:
      'Versionando o schema do banco de forma confiável e reversível.',
    content:
      "export class Init implements MigrationInterface {\n  async up(q: QueryRunner) {\n    await q.query('CREATE TABLE ...');\n  }\n}",
    tags: ['TypeORM', 'Backend', 'SQL'],
    thumbnailUrl: SAMPLE_THUMB,
  },
  {
    title: 'Design tokens com Tailwind',
    description:
      'Centralizando cores e tipografia com @theme para manter consistência.',
    content:
      '@theme {\n  --color-verde-destaque: #81FE88;\n  --color-grafite: #00090E;\n}',
    tags: ['Tailwind', 'CSS', 'Front-end'],
    thumbnailUrl: null,
  },
];

const USERS = [
  { name: 'Júlio', email: 'julio@codeconnect.dev' },
  { name: 'Márcia', email: 'marcia@codeconnect.dev' },
  { name: 'Gabriel Luz', email: 'gabriel.luz@codeconnect.dev' },
  { name: 'Marcela Lins', email: 'marcela.lins@codeconnect.dev' },
];

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  console.log('🌱 Iniciando seed...');

  const userRepo = AppDataSource.getRepository(User);
  const postRepo = AppDataSource.getRepository(Post);
  const commentRepo = AppDataSource.getRepository(Comment);
  const likeRepo = AppDataSource.getRepository(PostLike);

  // Limpa dados de posts (mantém usuários existentes do app).
  await likeRepo.delete({});
  await commentRepo.delete({});
  await postRepo.delete({});

  const passwordHash = await bcrypt.hash('senha123', 10);
  const users: User[] = [];
  for (const data of USERS) {
    let user = await userRepo.findOne({ where: { email: data.email } });
    if (!user) {
      user = await userRepo.save(userRepo.create({ ...data, passwordHash }));
    }
    users.push(user);
  }

  const posts: Post[] = [];
  for (let i = 0; i < POSTS.length; i++) {
    const data = POSTS[i];
    const author = users[i % users.length];
    const post = await postRepo.save(
      postRepo.create({
        title: data.title,
        slug: slugify(data.title),
        description: data.description,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        tags: data.tags,
        author,
      }),
    );
    posts.push(post);
  }

  // Comentários (com 1 nível de resposta) e curtidas em alguns posts.
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (i % 2 === 0) {
      const root = await commentRepo.save(
        commentRepo.create({
          content: 'Achei muito bom seu código, parabéns!',
          post,
          author: users[1],
          parent: null,
        }),
      );
      await commentRepo.save(
        commentRepo.create({
          content: 'Valeu! Fico feliz que tenha ajudado 🙌',
          post,
          author: post.author,
          parent: root,
        }),
      );
    }

    // Curtidas: cada usuário curte alguns posts.
    for (let u = 0; u < users.length; u++) {
      if ((i + u) % 3 === 0) {
        await likeRepo.save(likeRepo.create({ post, user: users[u] }));
      }
    }
  }

  console.log(
    `✅ Seed concluído: ${users.length} usuários, ${posts.length} posts.`,
  );
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Erro no seed:', error);
  process.exit(1);
});
