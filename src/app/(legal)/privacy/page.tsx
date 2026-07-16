import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Auge Motos",
  description:
    "Política de privacidade e proteção de dados do sistema Auge Motos.",
};

const PrivacyPage = () => {
  return (
    <article className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Política de Privacidade
        </h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: julho de 2025
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          1. Controlador dos Dados
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A{" "}
          <strong className="text-foreground">Balica Labs</strong>{" "}
          é a controladora dos dados pessoais tratados no âmbito do Sistema
          Auge Motos, conforme definido pela Lei Geral de Proteção de Dados
          (Lei nº 13.709/2018 — LGPD).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          2. Dados Coletados
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Durante a utilização do Sistema, os seguintes dados podem ser
          coletados:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong>Dados de cadastro:</strong> nome, e-mail, telefone e cargo
            dos usuários do Contratante;
          </li>
          <li>
            <strong>Dados operacionais:</strong> informações sobre clientes,
            motocicletas, vendas e financeiro inseridas pelo Contratante;
          </li>
          <li>
            <strong>Dados de navegação:</strong> endereço IP, tipo de
            navegador, páginas acessadas e duração da sessão;
          </li>
          <li>
            <strong>Cookies:</strong> cookies essenciais para autenticação e
            funcionamento do Sistema, além de cookies opcionais de analytics e
            marketing (mediante consentimento).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          3. Finalidade do Tratamento
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Os dados coletados são utilizados para:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Operacionalizar o Sistema e fornecer as funcionalidades contratadas;</li>
          <li>Autenticar e autorizar o acesso dos usuários;</li>
          <li>Gerar relatórios e métricas para o Contratante;</li>
          <li>Melhorar a experiência de uso e corrigir falhas;</li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          4. Compartilhamento com Terceiros
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A Balica Labs não comercializa dados pessoais. O
          compartilhamento ocorre apenas com:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Prestadores de serviços essenciais (hospedagem, processamento de
            pagamentos, envio de e-mails), que atuam como operadores e seguem
            nossas instruções;
          </li>
          <li>
            Autoridades legais, quando exigido por lei ou ordem judicial.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          5. Direitos do Titular
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Nos termos da LGPD, o titular dos dados possui os seguintes direitos:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Confirmação da existência de tratamento;</li>
          <li>Acesso aos dados;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Portabilidade dos dados;</li>
          <li>Eliminação dos dados tratados com consentimento;</li>
          <li>Revogação do consentimento.</li>
        </ul>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Para exercer seus direitos, entre em contato pelo e-mail{" "}
          <strong className="text-foreground">
            privacidade@balicassystem.com
          </strong>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          6. Armazenamento e Segurança
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Os dados são armazenados em servidores seguros, com criptografia em
          trânsito (TLS) e em repouso. Adotamos medidas técnicas e
          organizacionais para proteger os dados contra acessos não
          autorizados, perda acidental ou destruição.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">7. Cookies</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          O Sistema utiliza cookies essenciais para o funcionamento. Cookies de
          analytics e marketing são opcionais e podem ser configurados por meio
          do banner de consentimento exibido ao acessar o Sistema. O
          consentimento pode ser alterado a qualquer momento.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          8. Retenção dos Dados
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Os dados serão mantidos enquanto vigorar a relação contratual com o
          Contratante. Após o término, os dados poderão ser exportados pelo
          Contratante em até 30 dias e serão eliminados após esse período,
          salvo quando a lei exigir a manutenção por prazo superior.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          9. Alterações nesta Política
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Esta Política de Privacidade pode ser atualizada periodicamente.
          Recomenda-se a consulta regular para ciência de eventuais mudanças. O
          uso continuado do Sistema após a alteração constitui aceitação da
          versão revisada.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">10. Contato</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Dúvidas ou solicitações relacionadas à privacidade podem ser enviadas
          para:
        </p>
        <p className="text-sm leading-relaxed">
          <strong>Balica Labs</strong>
          <br />
          E-mail: privacidade@balicassystem.com
        </p>
      </section>
    </article>
  );
};

export default PrivacyPage;
