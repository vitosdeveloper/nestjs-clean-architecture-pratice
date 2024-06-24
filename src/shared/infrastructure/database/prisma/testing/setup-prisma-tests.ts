import { execSync } from 'child_process';

export const setupPrismaTests = () => {
  execSync('npm run migration:test');
};
