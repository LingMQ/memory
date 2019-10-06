defmodule MemoryWeb.GameChannel do

  use MemoryWeb, :channel

  alias Memory.Game

  def join("game:" <> name, payload, socket) do
    game = Game.new()
    socket = socket
             |> assign(:game, game)
             |> assign(:name, name)
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  def handle_in("guess", %{"i" => i, "j" => j}, socket) do
    name = socket.assigns[:name]
    case Game.click(socket.assigns[:game], i, j) do
      [ng, game] ->
        ng = game
             |> Map.put(:num_click, game.num_click + 1)
             |> Map.put(:current, game.current ++ [(i * 4 + j)])
        [ng, Map.put(ng, :current, [])]
        socket = assign(socket, :game, ng);
        Process.send_after(self(), {:refresh, game}, 5_000)
        {:reply, {:ok, %{"game" => Game.client_view(ng)}}, socket}
      game ->
        socket = assign(socket, :game, game);
        {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
    end
  end

  def handle_in("restart", _payload, socket) do
    name = socket.assigns[:name]
    game = Game.new();
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_info({:refresh, game}, socket) do
    socket = assign(socket, :game, game);
    push(socket, "refresh", %{"game" => Game.client_view(game)})
    {:noreply, socket}
  end

end