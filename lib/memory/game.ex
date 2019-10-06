defmodule Memory.Game do
  def new do
    %{
      list: new_game(),
      completed: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      current: [],
      num_click: 0,
    }
  end

  def client_view(game) do
      l = game.list
      comp = game.completed
      guesses = game.current
      %{
        status: compose_status(l, comp, guesses),
        clicks: game.num_click
      }
  end

  def click(game, i, j) do
    {:ok, curr} = Enum.fetch(game.list, i * 4 + j)
    # meaning the tile is not completed yet
    if Enum.member?(i * 4 + j) == false do
      case Enum.count(game.current) do
        0 ->
          game
          |> Map.put(:current, [i * 4 + j])
          |> Map.put(:num_click, game.num_click + 1)
        1 ->

          {:ok, previous} = Enum.fetch(game.list, Enum.at(game.current, 0))
          cond do
            previous == (i * 4 + j) -> game
            # find the same
            previous == curr ->
              game
              |> Map.put(:completed, game.completed ++ [curr])
              |> Map.put(:current, [])
              |> Map.put(:num_click, game.num_click + 1)
            previous != curr ->
              ng = game
                   |> Map.put(:num_click, game.num_click + 1)
                   |> Map.put(:completed, game.completed ++ [i * 4 + j])
              [ng, Map.put(ng, :current, [])]
          end
        _ -> game
      end
    else
      game
    end
  end

  defp compose_status(l, comp, guesses) do
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
  end

  # Generate a new game
  def new_game do
    # a example return output: ["C", "H", "G", "C", "E", "H", "D", "B", "F", "G", "F", "D", "A", "E", "A", "B"]
    "AABBCCDDEEFFGGHH"
    |> String.graphemes
    |> Enum.shuffle
  end
end