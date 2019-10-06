defmodule MemoryWeb.GameChannel do

  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent

  def join("game:" <> name, payload, socket) do
    game = BackupAgent.get(name) || Game.new()
    socket = socket
             |> assign(:game, game)
             |> assign(:name, name)
    BackupAgent.put(name, game)
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  def handle_in("guess", %{"i" => i, "j" => j}, socket) do
    name = socket.assigns[:name]
    click_num = i * 4 + j
    case Game.click(socket.assigns[:game], i, j) do
      [ng, game] ->
        ng = game
             |> Map.put(:current, game.current ++ [click_num])
        socket = assign(socket, :game, ng);
        BackupAgent.put(name, game)
        Process.send_after(self(), {:refresh, game}, 1000)
        {:reply, {:ok, %{"game" => Game.client_view(ng)}}, socket}
      game ->
        socket = assign(socket, :game, game);
        BackupAgent.put(name, game)
        {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
    end
  end

  def handle_in("restart", _payload, socket) do
    name = socket.assigns[:name]
    game = Game.new();
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_info({:refresh, game}, socket) do
    socket = assign(socket, :game, game);
    push(socket, "refresh", %{"game" => Game.client_view(game)})
    {:noreply, socket}
  end

end