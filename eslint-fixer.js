// eslint-fixer.js
// Script pour corriger automatiquement les erreurs ESLint dans le projet
// Usage: node eslint-fixer.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ROOT = '.'; // Chemin vers la racine du projet

// Fonction pour corriger les erreurs ESLint automatiquement
function autoFixEslintErrors() {
  console.log('🔄 Lancement de la correction automatique ESLint...');
  try {
    execSync('npx eslint --fix .', { stdio: 'inherit' });
    console.log('✅ Correction automatique ESLint terminée');
  } catch (error) {
    console.log('⚠️ Certaines erreurs persistent après correction automatique');
  }
}

// Fonction pour corriger les problèmes de guillemets dans .eslintrc.js
function fixEslintConfig() {
  const filePath = path.join(PROJECT_ROOT, '.eslintrc.js');
  if (!fs.existsSync(filePath)) {
    console.error('❌ Fichier .eslintrc.js non trouvé');
    return;
  }

  console.log('🔧 Correction du fichier .eslintrc.js...');
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Convertir tous les doubles guillemets en simples guillemets
    content = content
      // Remplacer les modules et plugins
      .replace(/"(@[^"]+|plugin:[^"]+|next\/[^"]+)"/g, "'$1'")
      // Remplacer les règles
      .replace(/"([^"]+\/[^"]+)":\s*"([^"]+)"/g, "'$1': '$2'")
      .replace(/"([^"\/]+)":\s*"([^"]+)"/g, "'$1': '$2'")
      // Corriger la règle no-unused-vars avec la bonne indentation
      .replace(
        /"@typescript-eslint\/no-unused-vars":\s*\["warn",/g,
        "'@typescript-eslint/no-unused-vars': [\n      'warn',",
      )
      .replace(/"argsIgnorePattern":\s*"(\^_)"/g, "  argsIgnorePattern: '$1'")
      .replace(/"varsIgnorePattern":\s*"(\^_)"/g, "  varsIgnorePattern: '$1'")
      .replace(/"caughtErrorsIgnorePattern":\s*"(\^_)"/g, "  caughtErrorsIgnorePattern: '$1'")
      .replace(/"ignoreRestSiblings":\s*true/g, '  ignoreRestSiblings: true,');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fichier .eslintrc.js corrigé');
  } catch (error) {
    console.error('❌ Erreur lors de la correction de .eslintrc.js:', error.message);
  }
}

// Fonction pour corriger les variables non utilisées
function fixUnusedVariables() {
  const filesToFix = {
    'app/api/game/answer.ts': [
      { from: 'const { gameId, userAnswer }', to: 'const { gameId, _userAnswer }' },
    ],
    'app/api/game/start.ts': [
      {
        from: 'async function generateQuestionsForRoom(roomID:',
        to: 'async function generateQuestionsForRoom(_roomID:',
      },
    ],
    'app/api/music/playlists.ts': [
      { from: 'import { NextRequest, NextResponse }', to: 'import { NextResponse }' },
    ],
    'prettier-fixer.js': [
      { from: 'const checkOutput = execSync', to: 'const _checkOutput = execSync' },
    ],
    'tests/example.test.tsx': [
      { from: 'import { render, screen }', to: 'import { _render, _screen }' },
    ],
  };

  console.log('🔧 Correction des variables non utilisées...');

  for (const [file, replacements] of Object.entries(filesToFix)) {
    const filePath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Fichier non trouvé: ${file}`);
      continue;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      for (const { from, to } of replacements) {
        if (content.includes(from)) {
          content = content.replace(from, to);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Variables corrigées dans: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la correction de ${file}:`, error.message);
    }
  }
}

// Fonction pour corriger les problèmes de guillemets dans les autres fichiers
function fixStringQuotes() {
  const filesToFix = ['utils/prisma.ts', 'jest.config.js', 'jest.setup.js', 'next-config.js'];

  console.log('🔧 Correction des guillemets dans les fichiers...');

  for (const file of filesToFix) {
    const filePath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Fichier non trouvé: ${file}`);
      continue;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');

      // Convertir les doubles guillemets en simples guillemets
      content = content.replace(/"([^"]+)"/g, (match, p1) => {
        // Éviter de remplacer les chaînes qui contiennent déjà des apostrophes
        if (p1.includes("'")) return match;
        return `'${p1}'`;
      });

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Guillemets corrigés dans: ${file}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la correction des guillemets dans ${file}:`, error.message);
    }
  }
}

// Fonction pour corriger les problèmes de retour à la ligne
function fixLineEndings() {
  console.log('🔄 Correction des retours à la ligne CRLF vers LF...');

  // Liste des fichiers connus pour avoir des problèmes de fins de ligne
  const filesToFix = [
    'prettier-fixer.js',
    'tests/example.test.tsx',
    'jest.setup.js',
    'jest.config.js',
  ];

  filesToFix.forEach((file) => {
    try {
      const filePath = path.join(PROJECT_ROOT, file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Remplacer CRLF (\r\n) par LF (\n)
        if (content.includes('\r\n')) {
          content = content.replace(/\r\n/g, '\n');
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Fins de ligne corrigées pour ${file}`);
        }
      }
    } catch (error) {
      console.error(
        `❌ Erreur lors de la correction des fins de ligne pour ${file}:`,
        error.message,
      );
    }
  });
}

// Fonction pour corriger les problèmes d'indentation
function fixIndentation() {
  const filesToFix = {
    'app/api/spotify/callback.ts': [{ from: /^\s{2}(\S+)/gm, to: '$1' }],
    'utils/prisma.ts': [
      {
        from: /process\.env\.NODE_ENV === "development"/g,
        to: "process.env.NODE_ENV === 'development'",
      },
      {
        from: /process\.env\.NODE_ENV !== "production"/g,
        to: "process.env.NODE_ENV !== 'production'",
      },
    ],
  };

  console.log("🔧 Correction des problèmes d'indentation...");

  for (const [file, replacements] of Object.entries(filesToFix)) {
    const filePath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Fichier non trouvé: ${file}`);
      continue;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      for (const { from, to } of replacements) {
        const newContent = content.replace(from, to);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Indentation corrigée dans: ${file}`);
      }
    } catch (error) {
      console.error(
        `❌ Erreur lors de la correction de l'indentation dans ${file}:`,
        error.message,
      );
    }
  }
}

// Fonction pour vérifier les problèmes ESLint restants
function checkRemainingErrors() {
  console.log('🔍 Vérification des erreurs ESLint restantes...');
  try {
    const output = execSync('npx eslint .', { encoding: 'utf8' });
    console.log('✅ Aucune erreur ESLint détectée !');
    return true;
  } catch (error) {
    console.log('⚠️ Des erreurs ESLint persistent:');
    console.log(error.stdout);
    return false;
  }
}

// Fonction pour exécuter Prettier sur tous les fichiers
function runPrettier() {
  console.log('🔄 Exécution de Prettier sur tous les fichiers...');
  try {
    execSync('npx prettier --write "app/**/*.{ts,tsx,js,jsx}" "prisma/**/*.{ts,js}"', {
      stdio: 'inherit',
    });
    console.log('✅ Formatage Prettier terminé');
  } catch (error) {
    console.error("❌ Erreur lors de l'exécution de Prettier:", error.message);
  }
}

// Fonction principale
function main() {
  console.log('🚀 Démarrage de la correction des erreurs ESLint...');

  // 1. Corriger les fins de ligne
  fixLineEndings();

  // 2. Corriger la configuration ESLint
  fixEslintConfig();

  // 3. Corriger les variables non utilisées
  fixUnusedVariables();

  // 4. Corriger les guillemets
  fixStringQuotes();

  // 5. Corriger les indentations
  fixIndentation();

  // 6. Exécuter Prettier pour corriger le formatage
  runPrettier();

  // 7. Lancer la correction automatique ESLint
  autoFixEslintErrors();

  // 8. Vérifier s'il reste des erreurs
  const success = checkRemainingErrors();

  if (success) {
    console.log('🎉 Toutes les erreurs ESLint ont été corrigées avec succès !');
  } else {
    console.log(
      "⚠️ Certaines erreurs ESLint n'ont pas pu être corrigées automatiquement. Veuillez les corriger manuellement.",
    );
  }
}

// Exécuter le script
main();
