const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function runCommand(command) {
    try {
        console.log(`\nExecutando: ${command}`);
        const output = execSync(command, { encoding: "utf-8" });
        if (output) console.log(output);
        return true;
    } catch (error) {
        console.error(`\n❌ Erro ao executar: ${command}\n`, error.stderr || error.message);
        return false;
    }
}

console.log("🚀 Iniciando processo de atualização do site...");

// 1. Verificar status do Git
try {
    const status = execSync("git status --porcelain", { encoding: "utf-8" }).trim();
    if (!status) {
        console.log("✨ Nenhuma alteração pendente para enviar.");
        rl.close();
        process.exit(0);
    }
    console.log("\n📝 Alterações detectadas:\n" + status);
} catch (e) {
    console.error("❌ Erro ao verificar status do Git. Certifique-se de que o Git está instalado e esta pasta é um repositório Git.");
    rl.close();
    process.exit(1);
}

// 2. Pedir mensagem de commit ou usar padrão
rl.question("\nDigite a descrição da alteração (ou pressione Enter para usar 'Atualização automática'): ", (answer) => {
    const commitMessage = answer.trim() || "Atualização automática";
    
    // 3. Executar o fluxo do Git
    console.log("\n📦 Preparando arquivos...");
    if (!runCommand("git add .")) {
        rl.close();
        process.exit(1);
    }

    console.log("💾 Salvando alterações (Commit)...");
    if (!runCommand(`git commit -m "${commitMessage}"`)) {
        rl.close();
        process.exit(1);
    }

    console.log("📤 Enviando para o GitHub (ramificação main)...");
    if (!runCommand("git push origin main")) {
        console.log("\n❌ Falha ao enviar para o GitHub. Verifique sua conexão e permissões do repositório.");
        rl.close();
        process.exit(1);
    }

    console.log("\n🎉 Sucesso! As alterações foram enviadas para o GitHub.");
    console.log("🔄 O GitHub Actions irá disparar o deploy automático na sua VPS em instantes.");
    rl.close();
});
