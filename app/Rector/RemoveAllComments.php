<?php

declare(strict_types=1);

namespace App\Rector;

use PhpParser\Node;
use PhpParser\Node\Stmt\ClassMethod;
use Rector\Rector\AbstractRector;
use Symplify\RuleDocGenerator\Exception\PoorDocumentationException;
use Symplify\RuleDocGenerator\ValueObject\CodeSample\CodeSample;
use Symplify\RuleDocGenerator\ValueObject\RuleDefinition;

final class RemoveAllComments extends AbstractRector
{
    /**
     * @throws PoorDocumentationException
     */
    public function getRuleDefinition(): RuleDefinition
    {
        return new RuleDefinition('Removes all comments from the code.', [
            new CodeSample(
                <<<'CODE_SAMPLE'
                        <?php
                        // This is a single-line comment
                        echo 'Hello world!'; // Inline comment
                        CODE_SAMPLE
                ,
                <<<'CODE_SAMPLE'
                        <?php
                        echo 'Hello world!';
                        CODE_SAMPLE
            ),
        ]);
    }

    /**
     * @return array<class-string<Node>>
     */
    public function getNodeTypes(): array
    {
        return [Node::class];
    }

    public function refactor(Node $node): ?Node
    {
        dump($node->getType());

        // Skip if node has no comments
        if ($node->getComments() === []) {
            return null;
        }

        // Only process if we're inside a class method
        if ($node instanceof ClassMethod) {
            $newComments = [];

            foreach ($node->getComments() as $comment) {
                // Keep comments that don't start with "//"
                if (! str_starts_with($comment->getText(), '// ')) {
                    $newComments[] = $comment;
                }
            }

            // Only update if we actually filtered out comments
            if (count($newComments) !== count($node->getComments())) {
                $node->setAttribute('comments', $newComments);

                return $node;
            }
        }

        return null;
    }
}
