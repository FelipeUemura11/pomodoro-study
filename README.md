# pomodoro-study

Aplicação web de estudo pela técnica pomodoro, com os intervalos dedicados à reza do terço.

O ciclo alterna **25 minutos de foco** e **5 minutos de reza**. Ao fim do foco a aplicação apita e o mostrador dá lugar a um terço, com a dezena da vez em destaque — a cada reza a dezena avança, e ao completar as cinco o terço reinicia. Durações e tema são configuráveis, e cada ciclo encerrado fica registrado no histórico.

## Como o tempo é contado

O timer **não decrementa um contador**. O estado guarda o instante de início (`startedAt`) e a duração, e o tempo restante é derivado do relógio a cada render:

```
restante = duração − (tempo acumulado + agora − início do trecho atual)
```

O intervalo de 250ms só existe para provocar o re-render; ele nunca é a fonte da verdade. Essa escolha é o que faz a contagem sobreviver a **aba em segundo plano** (onde o navegador estrangula os timers) e a **reload da página** — o ciclo retoma exatamente de onde estava.

## Arquitetura

A regra central é separar **domínio** de **apresentação**. Toda a lógica de ciclos, terço e histórico é TypeScript puro, sem React e sem DOM, o que permite testar a sequência inteira de um terço em milissegundos em vez de esperar tempo real.

```
frontend/src/
  domain/          TS puro, zero React — o coração testável
    timer/         máquina de estados do ciclo
    cycles/        sequência foco → reza
    rosary/        dezena ativa e progresso do terço
    settings/      durações e validação
    history/       registro dos ciclos
  ports/           interface de persistência
  infra/           localStorage, áudio, relógio
  state/           providers (Context + estado)
  hooks/           tick derivado, título da aba
  components/      apresentacionais, sem regra de negócio
  pages/           Home, History, Settings
```

### Máquina de estados

O ciclo é uma união discriminada — `idle | running | paused` — e não um punhado de booleanos. `runningSince` só existe no estado `running`, o que torna "pausado e rodando ao mesmo tempo" impossível de representar.

As transições são funções puras que **devolvem efeitos em vez de executá-los**:

```ts
transition(state, action, settings) → { state, effects: [{ type: 'playAlarm' }, …] }
```

Quem consome decide como tocar o alarme e gravar o histórico. É o que permite testar "ao fim do foco sai um alarme e um registro" sem mock de áudio nenhum.

### Persistência

Configurações, histórico, tema e o próprio ciclo em andamento vão para o `localStorage`, sempre atrás da interface em `ports/storage.ts`. Nenhum componente toca o `localStorage` direto: trocar por uma API é substituir o adapter em `infra/`, e nada mais muda.

Tudo que volta do storage passa por um parser (`parseSettings`, `parseHistory`, `parseTimerState`) — o que vem de lá é `unknown`, e dado velho ou corrompido precisa degradar para os padrões em vez de virar `NaN` dentro do timer.

### Tema

O `ThemeProvider` escreve `data-theme` no `<html>`, e `index.css` define tokens semânticos (`--on-app-bg`, `--surface`, `--primary`…) para claro e escuro. Os componentes pedem o token; o tema decide o valor. Sem preferência gravada, segue o sistema.

## Stack

React 19 · TypeScript · Vite · React Router · CSS Modules · Vitest · lucide-react
