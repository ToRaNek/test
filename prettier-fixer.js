// prettier-fixer.js
// Ce script corrige automatiquement les erreurs Prettier dans le projet
// Pour exécuter: node prettier-fixer.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ROOT = '.'; // Chemin vers la racine du projet

// Fonction pour exécuter Prettier sur tous les fichiers
function fixAllFiles() {
  try {
    console.log('🔍 Détection des fichiers à corriger...');

    // Exécute Prettier en mode écriture sur tous les fichiers
    const command = 'npx prettier --write "app/**/*.{ts,tsx,js,jsx}" "prisma/**/*.{ts,js}"';
    console.log(`Exécution de: ${command}`);

    const output = execSync(command, { cwd: PROJECT_ROOT, encoding: 'utf8' });
    console.log('✅ Correction terminée!');
    console.log(output);

    // Vérifier si la correction a résolu tous les problèmes
    try {
      console.log('🧪 Vérification de la correction...');
      const _checkOutput = execSync(
        'npx prettier --check "app/**/*.{ts,tsx,js,jsx}" "prisma/**/*.{ts,js}"',
        { cwd: PROJECT_ROOT, encoding: 'utf8' },
      );
      console.log('✅ Toutes les erreurs Prettier ont été corrigées!');
    } catch (checkError) {
      console.log('⚠️ Certaines erreurs persistent. Correction manuelle additionnelle requise.');
      console.log('Erreurs restantes:');
      console.log(checkError.stdout);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error.message);
    if (error.stdout) console.error(error.stdout);
    if (error.stderr) console.error(error.stderr);
  }
}

// Fonction pour corriger manuellement les problèmes spécifiques
function fixSpecificIssues() {
  console.log('🔧 Correction manuelle de problèmes spécifiques...');

  // Liste des corrections spécifiques à appliquer
  const fixes = [
    {
      file: 'app/api/auth/[...nextauth].ts',
      replacements: [
        {
          from: "account?.provider !== 'google' &&\n          account?.provider !== 'discord'",
          to: "account?.provider !== 'google' && account?.provider !== 'discord'",
        },
      ],
    },
    // Ajoutez ici d'autres corrections spécifiques pour les fichiers concernés
  ];

  // Applique chaque correction
  for (const fix of fixes) {
    try {
      const filePath = path.join(PROJECT_ROOT, fix.file);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Fichier non trouvé: ${fix.file}`);
        continue;
      }

      let content = fs.readFileSync(filePath, 'utf8');

      for (const replacement of fix.replacements) {
        content = content.replace(replacement.from, replacement.to);
      }

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrections appliquées à ${fix.file}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la correction de ${fix.file}:`, error.message);
    }
  }
}

// Fonction principale
function main() {
  console.log('🛠️ Démarrage de la correction des erreurs Prettier...');

  // Étape 1: Corriger les problèmes spécifiques qui ne seraient pas pris en charge par Prettier
  fixSpecificIssues();

  // Étape 2: Lancer Prettier sur tous les fichiers
  fixAllFiles();

  console.log('🎉 Processus de correction terminé!');
}

// Exécuter le script
main();
