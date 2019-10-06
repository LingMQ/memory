defmodule Memory.Game do
  def new do
    %{
      list: new_game(),
      completed: [],
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
        num_click: game.num_click
      }
  end

  def click(game, i, j) do
    click_num = i * 4 + j
    curr = Enum.at(game.list, click_num)
    # meaning the tile is not completed yet
    if Enum.member?(game.completed, click_num) == false do
      case Enum.count(game.current) do
        0 ->
          game
          |> Map.put(:current, [click_num])
          |> Map.put(:num_click, game.num_click + 1)
        1 ->
          prev_index = Enum.at(game.current, 0)
          previous = Enum.at(game.list, prev_index)
          cond do
            # find the same
            previous == curr ->
              game
              |> Map.put(:completed, game.completed ++ [click_num, prev_index])
              |> Map.put(:current, [])
              |> Map.put(:num_click, game.num_click + 1)
            previous != curr ->
              ng = game
                   |> Map.put(:num_click, game.num_click + 1)
              [ng, Map.put(ng, :current, [])]
          end
        _ -> game
      end
    else
      game
    end
  end

  defp compose_status(l, comp, guesses) do
    new_list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    new_list
    |> Enum.map(fn index ->
      if Enum.member?(comp, index) do
        Enum.at(l, index)
      else
        if Enum.member?(guesses, index) do
          Enum.at(l, index)
        else
          ""
        end
      end
    end)

  end

  # Generate a new game
  def new_game do
    # a example return output: ["C", "H", "G", "C", "E", "H", "D", "B", "F", "G", "F", "D", "A", "E", "A", "B"]
    "AABBCCDDEEFFGGHH"
    |> String.graphemes
    |> Enum.shuffle
  end
end