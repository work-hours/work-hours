<?php

declare(strict_types=1);

namespace App\Rector;

use PhpParser\Node;
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
        return [Node::class]; // Apply to all node types
    }

    public function refactor(Node $node): ?Node
    {
        $node->setAttribute('comments', []); // Remove comments attribute

        return $node;
    }
}
