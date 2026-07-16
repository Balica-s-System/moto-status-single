import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Auge Motos",
  description: "Termos e condições de uso do sistema Auge Motos.",
};

const TermsPage = () => {
  return (
    <article className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: julho de 2025
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">1. Objeto</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Estes Termos de Uso regulam a utilização do sistema de gestão Auge
          Motos (&ldquo;Sistema&rdquo;), fornecido pela{" "}
          <strong className="text-foreground">Balica Labs</strong>
          (&ldquo;Fornecedora&rdquo;) à empresa contratante
          (&ldquo;Contratante&rdquo;) mediante assinatura ou licença de uso.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          2. Propriedade Intelectual
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          O Sistema, incluindo seu código-fonte, design, logotipos, marcas e
          documentação, é propriedade exclusiva da Balica Labs e está
          protegido pelas leis de propriedade intelectual. O Contratante recebe
          uma licença limitada, não exclusiva e intransferível para uso do
          Sistema, não adquirindo qualquer direito de propriedade sobre ele.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          É vedado ao Contratante copiar, modificar, distribuir, sublicenciar,
          realizar engenharia reversa ou criar obras derivadas do Sistema sem
          autorização expressa por escrito da Balica Labs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          3. Licença de Uso
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A licença de uso é concedida mediante pagamento da contraprestação
          prevista em contrato comercial firmado entre as partes. O uso do
          Sistema é restrito ao ambiente operacional do Contratante e de seus
          colaboradores autorizados.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          4. Obrigações do Contratante
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Manter a confidencialidade das credenciais de acesso;</li>
          <li>Não compartilhar o acesso com terceiros não autorizados;</li>
          <li>Utilizar o Sistema de acordo com a legislação vigente;</li>
          <li>Não tentar burlar mecanismos de segurança do Sistema;</li>
          <li>
            Comunicar imediatamente qualquer uso não autorizado ou violação de
            segurança.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          5. Suporte e Manutenção
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A Balica Labs envidará esforços para manter o Sistema
          operacional e seguro, realizando manutenções periódicas e correções
          de falhas. O nível de suporte e os prazos de atendimento serão
          definidos no contrato comercial.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          6. Limitação de Responsabilidade
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A Balica Labs não será responsável por danos indiretos,
          lucros cessantes ou perda de dados decorrentes do uso do Sistema,
          exceto nos casos previstos em lei. A responsabilidade total da
          Fornecedora está limitada ao valor pago pelo Contratante nos últimos
          12 meses.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          7. Vigência e Rescisão
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Estes Termos vigoram enquanto perdurar a licença de uso. Em caso de
          rescisão do contrato, o acesso ao Sistema será cancelado e o
          Contratante deverá realizar a exportação de seus dados dentro do
          prazo estipulado.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          8. Disposições Gerais
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro
          da comarca de [cidade] para dirimir quaisquer controvérsias. Caso
          alguma cláusula seja considerada inválida, as demais permanecerão em
          pleno vigor.
        </p>
      </section>
    </article>
  );
};

export default TermsPage;
